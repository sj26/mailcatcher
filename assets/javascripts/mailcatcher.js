// Add a new jQuery selector expression which does a case-insensitive :contains
jQuery.expr.pseudos.icontains = function(a, i, m) {
  return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

class MailCatcher {
  constructor() {
    $("#messages").on("click", "tr", (e) => {
      e.preventDefault();
      this.loadMessage($(e.currentTarget).attr("data-message-id"));
    });

    $("input[name=search]").on("keyup", (e) => {
      const query = $.trim($(e.currentTarget).val());
      if (query) {
        this.searchMessages(query);
      } else {
        this.clearSearch();
      }
      this.applyFilters();
    });

    $("#searchClear").on("click", (e) => {
      e.preventDefault();
      $("input[name=search]").val("").focus();
      this.clearSearch();
      this.applyFilters();
    });

    $("#attachmentFilter").on("change", (e) => {
      this.applyFilters();
    });

    $("#messages").on("click", "th.sortable, th.sortable *", (e) => {
      // Handle clicks on header or any element within it (svg, path, text)
      const $header = $(e.currentTarget).closest("th.sortable");
      const field = $header.data("sort-field");
      if (field) {
        this.setSortField(field);
      }
    });

    $("#message").on("click", ".views .format.tab a", (e) => {
      e.preventDefault();
      this.loadMessageBody(this.selectedMessage(), $($(e.currentTarget).parent("li")).data("message-format"));
    });

    $("#message iframe").on("load", () => {
      this.decorateMessageBody();
    });

    $("#resizer").on("mousedown", (e) => {
      e.preventDefault();
      const events = {
        mouseup: (e) => {
          e.preventDefault();
          $(window).off(events);
        },
        mousemove: (e) => {
          e.preventDefault();
          this.resizeTo(e.clientY);
        }
      };
      $(window).on(events);
    });

    this.resizeToSaved();

    this.favcount = new Favcount($(`link[rel="icon"]`).attr("href"));

    // Keyboard shortcuts using native keyboard events
    document.addEventListener("keydown", (e) => {
      // Don't trigger shortcuts when typing in search box
      if (e.target.type === "search") return;

      switch (e.code) {
        case "ArrowUp":
          e.preventDefault();
          if (this.selectedMessage()) {
            this.loadMessage($("#messages tr.selected").prevAll(":visible").first().data("message-id"));
          } else {
            this.loadMessage($("#messages tbody tr[data-message-id]").first().data("message-id"));
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (this.selectedMessage()) {
            this.loadMessage($("#messages tr.selected").nextAll(":visible").first().data("message-id"));
          } else {
            this.loadMessage($("#messages tbody tr[data-message-id]:first").data("message-id"));
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          this.openTab(this.previousTab());
          break;

        case "ArrowRight":
          e.preventDefault();
          this.openTab(this.nextTab());
          break;

        case "Backspace":
        case "Delete":
          e.preventDefault();
          const id = this.selectedMessage();
          if (id != null) {
            $.ajax({
              url: new URL(`messages/${id}`, document.baseURI).toString(),
              type: "DELETE",
              success: () => {
                this.removeMessage(id);
              },
              error: () => {
                alert("Error while removing message.");
              }
            });
          }
          break;
      }

      // Handle Ctrl+Up / Cmd+Up and Ctrl+Down / Cmd+Down
      if (e.ctrlKey || e.metaKey) {
        switch (e.code) {
          case "ArrowUp":
            e.preventDefault();
            this.loadMessage($("#messages tbody tr[data-message-id]:visible").first().data("message-id"));
            break;
          case "ArrowDown":
            e.preventDefault();
            this.loadMessage($("#messages tbody tr[data-message-id]:visible").last().data("message-id"));
            break;
        }
      }
    });

    this.refresh();
    this.subscribe();

    // Check for updates asynchronously
    setTimeout(() => this.checkForUpdates(), 500);
  }

  parseDate(dateString) {
    if (typeof dateString === "string") {
      return new Date(dateString);
    } else {
      return dateString;
    }
  }

  normalizeMessageId(messageId) {
    const id = Number(messageId);
    if (!Number.isInteger(id) || id < 0) {
      throw new Error(`Invalid message id: ${messageId}`);
    }
    return id;
  }

  buildMessageUrl(messageId, format = "json") {
    const id = this.normalizeMessageId(messageId);
    const safeFormat = ["json", "html", "plain", "source", "transcript", "eml"].includes(format) ? format : "json";
    return new URL(`messages/${id}.${safeFormat}`, document.baseURI).toString();
  }

  buildMessagePathUrl(messageId, pathSuffix) {
    const id = this.normalizeMessageId(messageId);
    const safeSuffix = String(pathSuffix).replace(/^\/+/, "");
    return new URL(`messages/${id}/${safeSuffix}`, document.baseURI).toString();
  }

  buildMessagePartUrl(messageId, cid) {
    const id = this.normalizeMessageId(messageId);
    return new URL(`messages/${id}/parts/${encodeURIComponent(cid)}`, document.baseURI).toString();
  }

  formatDate(date) {
    if (typeof date === "string") {
      date = this.parseDate(date);
    }
    if (!date) return null;

    // Format: "Day, DD MMM YYYY HH:MM:SS"
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  formatSize(bytes) {
    if (!bytes) {
      return "-";
    }
    bytes = parseInt(bytes);
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2).replace(/\.?0+$/, "") + " " + sizes[i];
  }

  messagesCount() {
    return $("#messages tr").length - 1;
  }

  updateMessagesCount() {
    this.favcount.set(this.messagesCount());
    document.title = `MailCatcher (${this.messagesCount()})`;
  }

  tabs() {
    return $("#message ul").children(".tab");
  }

  getTab = (i) => {
    return $(this.tabs()[i]);
  }

  selectedTab = () => {
    return this.tabs().index($("#message li.tab.selected"));
  }

  openTab = (i) => {
    this.getTab(i).children("a").click();
  }

  previousTab = (tab) => {
    let i = tab != null && tab === 0 ? tab : this.selectedTab() - 1;
    if (i < 0) i = this.tabs().length - 1;
    if (this.getTab(i).is(":visible")) {
      return i;
    } else {
      return this.previousTab(i - 1);
    }
  }

  nextTab = (tab) => {
    let i = tab != null ? tab : this.selectedTab() + 1;
    if (i > this.tabs().length - 1) i = 0;
    if (this.getTab(i).is(":visible")) {
      return i;
    } else {
      return this.nextTab(i + 1);
    }
  }

  haveMessage(message) {
    if (message && message.id != null) {
      message = message.id;
    }
    return $(`#messages tbody tr[data-message-id="${message}"]`).length > 0;
  }

  selectedMessage() {
    return $("#messages tr.selected").data("message-id");
  }

  currentSearchQuery = "";
  currentAttachmentFilter = "all";
  currentSortField = null;
  currentSortDirection = "asc";

  searchMessages(query) {
    this.currentSearchQuery = query;
    this.applyFilters();
  }

  clearSearch() {
    this.currentSearchQuery = "";
    this.applyFilters();
  }

  applyFilters() {
    const $rows = $("#messages tbody tr");
    const query = this.currentSearchQuery;
    const attachmentFilter = $("#attachmentFilter").val();
    this.currentAttachmentFilter = attachmentFilter;

    $rows.each((i, row) => {
      const $row = $(row);

      // Apply search filter
      let searchMatches = true;
      if (query) {
        const tokens = query.split(/\s+/);
        const text = $row.text().toUpperCase();
        searchMatches = tokens.every(token => text.indexOf(token.toUpperCase()) >= 0);
      }

      // Apply attachment filter
      let attachmentMatches = true;
      const messageId = $row.attr("data-message-id");
      if (messageId && attachmentFilter !== "all") {
        let hasAttachments = $row.data("has-attachments");

        // If we don't have attachment data yet, fetch it from the server
        if (hasAttachments === undefined) {
          $.getJSON(this.buildMessageUrl(messageId), (message) => {
            $row.data("has-attachments", message.attachments && message.attachments.length > 0);
            // Reapply filters after loading the data
            this.applyFilters();
          });
          return;
        }

        if (attachmentFilter === "with") {
          attachmentMatches = hasAttachments;
        } else if (attachmentFilter === "without") {
          attachmentMatches = !hasAttachments;
        }
      }

      // Show/hide based on both filters
      if (searchMatches && attachmentMatches) {
        $row.show();
      } else {
        $row.hide();
      }
    });

    this.sortMessages();
  }

  setSortField(field) {
    // Toggle sort direction if clicking the same field
    if (this.currentSortField === field) {
      this.currentSortDirection = this.currentSortDirection === "asc" ? "desc" : "asc";
    } else {
      this.currentSortField = field;
      this.currentSortDirection = "asc";
    }

    console.log(`setSortField called: ${field}`);
    this.updateSortIndicators();
    this.sortMessages();
  }

  updateSortIndicators() {
    // Remove active class from all headers and hide all icons
    $("th.sortable").removeClass("active asc desc");
    $("th.sortable .sort-icon-up").hide();
    $("th.sortable .sort-icon-down").show();

    // Add active class and show appropriate icon for current sort field
    if (this.currentSortField) {
      const $activeTh = $(`th.sortable[data-sort-field='${this.currentSortField}']`);
      $activeTh.addClass("active " + this.currentSortDirection);

      // Show the appropriate arrow based on sort direction
      if (this.currentSortDirection === "desc") {
        $activeTh.find(".sort-icon-up").show();
        $activeTh.find(".sort-icon-down").hide();
      } else {
        $activeTh.find(".sort-icon-down").show();
        $activeTh.find(".sort-icon-up").hide();
      }
    }
  }

  sortMessages() {
    const $tbody = $("#messages tbody");
    const $rows = $tbody.find("tr");

    if ($rows.length === 0 || !this.currentSortField) return;

    // Convert rows to array and sort
    let rowsArray = $rows.toArray();

    rowsArray.sort((a, b) => {
      const $aRow = $(a);
      const $bRow = $(b);

      const aValue = this.getSortValue($aRow, this.currentSortField);
      const bValue = this.getSortValue($bRow, this.currentSortField);

      // Handle null/empty values
      if (aValue === null || aValue === "") {
        return bValue === null || bValue === "" ? 0 : 1;
      }
      if (bValue === null || bValue === "") {
        return -1;
      }

      // Compare based on field type
      let comparison = this.compareSortValues(aValue, bValue, this.currentSortField);

      if (this.currentSortDirection === "desc") {
        comparison *= -1;
      }
      return comparison;
    });

    // Detach tbody and re-append sorted rows for better performance
    $tbody.detach();
    rowsArray.forEach((row) => {
      $tbody.append(row);
    });
    $("#messages table").append($tbody);

    console.log(`Sorted by ${this.currentSortField} (${this.currentSortDirection})`);
  }

  getSortValue($row, field) {
    switch (field) {
      case "from":
        // Extract text from from cell, handling the sender-text-container
        const $fromCell = $row.find("td.from-cell");
        // Get the email from sender-email div if available, otherwise get all text
        const $senderEmail = $fromCell.find(".sender-email").first();
        if ($senderEmail.length > 0) {
          return $senderEmail.text().trim();
        }
        return $fromCell.text().trim();

      case "to":
        // Extract text from to cell, handling the sender-text-container
        const $toCell = $row.find("td.to-cell");
        // Get the email from sender-email div if available, otherwise get all text
        const $senderEmailTo = $toCell.find(".sender-email").first();
        if ($senderEmailTo.length > 0) {
          return $senderEmailTo.text().trim();
        }
        return $toCell.text().trim();

      case "subject":
        // Extract subject text
        const $subjectCell = $row.find("td.subject-cell");
        const $subjectText = $subjectCell.find(".subject-text");
        if ($subjectText.length > 0) {
          return $subjectText.text().trim();
        }
        return $subjectCell.text().trim();

      case "received":
        // Get the created_at value - it's in the date cell (6th td)
        return $row.find("td").eq(5).text().trim();

      default:
        return "";
    }
  }

  compareSortValues(a, b, field) {
    if (field === "received") {
      // Parse dates for comparison
      const dateA = new Date(a);
      const dateB = new Date(b);

      if (isNaN(dateA.getTime())) {
        return isNaN(dateB.getTime()) ? 0 : 1;
      }
      if (isNaN(dateB.getTime())) {
        return -1;
      }

      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        return 0;
      }
    } else {
      // String comparison (case-insensitive for email/subject)
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      if (aLower < bLower) {
        return -1;
      } else if (aLower > bLower) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  formatSender(sender) {
    // Handle sender format: either "email@example.com" or "<email@example.com>" or "Name <email@example.com>"
    if (!sender) {
      return "";
    }

    // Remove angle brackets if present
    sender = sender.replace(/^<(.+?)>$/, "$1");

    // Handle "Name <email>" format
    const match = sender.match(/^(.+?)\s+<(.+?)>$/);
    if (match) {
      const name = match[1].trim();
      const email = match[2].trim();
      return `${name} ${email}`;
    }

    // Return clean email (angle brackets already removed above)
    return sender;
  }

  parseSender(sender) {
    // Parse sender into name and email parts
    // Returns {name: string, email: string}
    if (!sender) {
      return {name: "", email: ""};
    }

    // Remove angle brackets if present
    const cleanSender = sender.replace(/^<(.+?)>$/, "$1");

    // Handle "Name <email>" format
    const match = cleanSender.match(/^(.+?)\s+<(.+?)>$/);
    if (match) {
      return {name: match[1].trim(), email: match[2].trim()};
    }

    // Just an email address
    return {name: "", email: cleanSender};
  }

  getEmailPreview(message, callback) {
    // Extract email preview using tiers 2-3 of the preview text fallback system:
    // Tier 2: Extract preheader text from HTML body (hidden text at start of HTML email)
    // Tier 3: Extract first 100 characters of email content (fallback)
    // This is async so we pass a callback
    // Note: Tier 1 (Preview-Text header) is handled in addMessage() before calling this method
    if (message.formats && (message.formats.includes("plain") || message.formats.includes("html"))) {
      // Fetch the plain text or HTML version to extract preview
      const format = message.formats.includes("plain") ? "plain" : "html";
      $.ajax({
        url: this.buildMessageUrl(message.id, format),
        type: "GET",
        success: (data) => {
          // Extract first 100 characters from plain text or HTML text content.
          let preview = data;
          if (format === "html") {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            preview = doc.body ? doc.body.textContent || "" : "";
          }
          preview = preview.trim();
          preview = preview.substring(0, 100);
          if (preview.length >= 100) {
            preview += "...";
          }
          if (callback) callback(preview);
        },
        error: () => {
          if (callback) callback("");
        }
      });
    } else {
      if (callback) callback("");
    }
  }

  addMessage(message) {
    // Format sender: remove angle brackets and show name + email
    const formattedSender = this.formatSender(message.sender || "No sender");

    // Check if email has attachments (from detailed message data, or assume false initially)
    const hasAttachments = message.attachments && message.attachments.length > 0;

    // Create subject cell with bold subject and preview
    const $subjectCell = $("<td/>").addClass("subject-cell");
    const $subject = $("<div/>").addClass("subject-text").html(`<strong>${this.escapeHtml(message.subject || "No subject")}</strong>`);
    const $preview = $("<div/>").addClass("preview-text").text("");
    $subjectCell.append($subject).append($preview);

    // Create from cell with two-tier format (name bold + email preview)
    const $fromCell = $("<td/>").addClass("from-cell");
    const senderParts = this.parseSender(message.sender || "");

    const $fromCellText = $("<div/>").addClass("sender-text-container");
    if (senderParts.name) {
      // Show name in bold and email below
      const $senderName = $("<div/>").addClass("sender-name").html(`<strong>${this.escapeHtml(senderParts.name)}</strong>`);
      const $senderEmail = $("<div/>").addClass("sender-email").text(senderParts.email);
      $fromCellText.append($senderName).append($senderEmail);
    } else {
      // Just email address
      const $senderEmail = $("<div/>").addClass("sender-email").text(senderParts.email);
      $fromCellText.append($senderEmail);
    }

    $fromCell.append($fromCellText).toggleClass("blank", !message.sender);

    // Create attachment indicator cell
    const $attachmentCell = $("<td/>").addClass("col-attachments");
    if (hasAttachments) {
      $attachmentCell.text("📎");
    }

    // Create BIMI cell with generic icon (will be updated with actual logo if available)
    const $bimiCell = $("<td/>").addClass("col-bimi");
    // Add generic BIMI icon SVG
    const $bimiIcon = $("<svg/>").addClass("bimi-placeholder-icon")
      .attr("viewBox", "0 0 24 24")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", "2");
    $bimiIcon.append($("<circle/>").attr("cx", "12").attr("cy", "12").attr("r", "10"));
    $bimiIcon.append($("<text/>").attr("x", "12").attr("y", "13").attr("text-anchor", "middle").attr("font-size", "10").attr("font-weight", "bold").text("B"));
    $bimiCell.append($bimiIcon);

    // Create recipients cell with two-tier format (name bold + email preview)
    const $toCell = $("<td/>").addClass("to-cell");
    if (message.recipients && message.recipients.length > 0) {
      // Show first recipient (same pattern as From column)
      const firstRecipient = message.recipients[0];
      const recipientParts = this.parseSender(firstRecipient);

      const $toCellText = $("<div/>").addClass("sender-text-container");
      if (recipientParts.name) {
        // Show name in bold and email below
        const $recipientName = $("<div/>").addClass("sender-name").html(`<strong>${this.escapeHtml(recipientParts.name)}</strong>`);
        const $recipientEmail = $("<div/>").addClass("sender-email").text(recipientParts.email);
        $toCellText.append($recipientName).append($recipientEmail);
      } else {
        // Just email address
        const $recipientEmail = $("<div/>").addClass("sender-email").text(recipientParts.email);
        $toCellText.append($recipientEmail);
      }

      $toCell.append($toCellText);
    } else {
      $toCell.addClass("blank").text("No recipients");
    }

    const $tr = $("<tr />").attr("data-message-id", message.id.toString())
      .append($attachmentCell)
      .append($bimiCell)
      .append($fromCell)
      .append($toCell)
      .append($subjectCell)
      .append($("<td/>").text(this.formatDate(message.created_at)))
      .append($("<td/>").text(this.formatSize(message.size)));

    // Store attachment information for filtering
    $tr.data("has-attachments", hasAttachments);
    $tr.prependTo($("#messages tbody"));

    // Fetch full message data to get attachment and BIMI info
    $.getJSON(`messages/${message.id}.json`, (fullMessage) => {
      // Update From and To cells with email headers if available
      // Use from_header/to_header from email headers, fall back to sender/recipients from envelope
      if (fullMessage.from_header) {
        $fromCellText.empty();
        const fromParts = this.parseSender(fullMessage.from_header);
        if (fromParts.name) {
          const $fromName = $("<div/>").addClass("sender-name").html(`<strong>${this.escapeHtml(fromParts.name)}</strong>`);
          const $fromEmail = $("<div/>").addClass("sender-email").text(fromParts.email);
          $fromCellText.append($fromName).append($fromEmail);
        } else {
          const $fromEmail = $("<div/>").addClass("sender-email").text(fromParts.email);
          $fromCellText.append($fromEmail);
        }
      }

      if (fullMessage.to_header) {
        $toCell.empty();
        const recipients = fullMessage.to_header.split(",").map((email) => email.trim());
        if (recipients.length > 0) {
          const firstRecipient = recipients[0];
          const recipientParts = this.parseSender(firstRecipient);

          const $toCellText = $("<div/>").addClass("sender-text-container");
          if (recipientParts.name) {
            const $recipientName = $("<div/>").addClass("sender-name").html(`<strong>${this.escapeHtml(recipientParts.name)}</strong>`);
            const $recipientEmail = $("<div/>").addClass("sender-email").text(recipientParts.email);
            $toCellText.append($recipientName).append($recipientEmail);
          } else {
            const $recipientEmail = $("<div/>").addClass("sender-email").text(recipientParts.email);
            $toCellText.append($recipientEmail);
          }

          $toCell.append($toCellText);
        }
      }

      // Update attachment cell if attachments are present
      if (fullMessage.attachments && fullMessage.attachments.length > 0) {
        $tr.data("has-attachments", true);
        $attachmentCell.text("📎");
      }

      // Extract and display email preview using 3-tier fallback system:
      // Tier 1: Use Preview-Text header if present (de facto standard email header)
      // Tier 2: Extract from HTML body preheader (hidden text at start of HTML email)
      // Tier 3: Use first lines of email content
      if (fullMessage.preview_text) {
        // Tier 1: Preview-Text header from email metadata
        $preview.text(fullMessage.preview_text);
      } else {
        // Tiers 2-3: Extract from email body (HTML preheader or first content lines)
        this.getEmailPreview(fullMessage, (previewText) => {
          $preview.text(previewText);
        });
      }

      // Add BIMI image if available in message headers
      if (fullMessage.bimi_location) {
        $bimiCell.empty();
        const $bimiImg = $("<img/>").addClass("bimi-image").attr("src", fullMessage.bimi_location).attr("alt", "BIMI");
        $bimiCell.append($bimiImg);
      }
    });

    this.updateMessagesCount();
    this.applyFilters();
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  removeMessage(id) {
    const messageRow = $(`#messages tbody tr[data-message-id="${id}"]`);
    const isSelected = messageRow.is(".selected");
    let switchTo;
    if (isSelected) {
      switchTo = messageRow.next().data("message-id") || messageRow.prev().data("message-id");
    }
    messageRow.remove();
    if (isSelected) {
      if (switchTo) {
        this.loadMessage(switchTo);
      } else {
        this.unselectMessage();
      }
    }
    this.updateMessagesCount();
  }

  clearMessages() {
    $("#messages tbody tr").remove();
    this.unselectMessage();
    this.updateMessagesCount();
  }

  scrollToRow(row) {
    const relativePosition = row.offset().top - $("#messages").offset().top;
    if (relativePosition < 0) {
      $("#messages").scrollTop($("#messages").scrollTop() + relativePosition - 20);
    } else {
      const overflow = relativePosition + row.height() - $("#messages").height();
      if (overflow > 0) {
        $("#messages").scrollTop($("#messages").scrollTop() + overflow + 20);
      }
    }
  }

  unselectMessage() {
    $("#messages tbody, #message .metadata dd").empty();
    $(".attachments-list").empty();
    $(".attachments-column").removeClass("visible");
    $("#contentTypeNotice").hide().text("");
    $("#message iframe").attr("src", "about:blank");
    return null;
  }

  cleanEmailAddress(email) {
    // Remove angle brackets if present
    if (email) {
      return email.replace(/^<(.+)>$/, "$1");
    } else {
      return email;
    }
  }

  loadMessage(id) {
    if (id != null && id.id != null) {
      id = id.id;
    }
    if (!id) {
      id = $("#messages tr.selected").attr("data-message-id");
    }

    if (id != null) {
      $(`#messages tbody tr:not([data-message-id='${id}'])`).removeClass("selected");
      const messageRow = $(`#messages tbody tr[data-message-id='${id}']`);
      messageRow.addClass("selected");
      this.scrollToRow(messageRow);

      $.getJSON(this.buildMessageUrl(id), (message) => {
        // Update the row's attachment data
        const messageRow = $(`#messages tbody tr[data-message-id='${id}']`);
        messageRow.data("has-attachments", message.attachments && message.attachments.length > 0);

        $("#message .metadata dd.created_at").text(this.formatDate(message.created_at));
        const hasRenderableBody = message.formats && (message.formats.includes("html") || message.formats.includes("plain"));
        if (hasRenderableBody) {
          $("#contentTypeNotice").hide().text("");
        } else {
          $("#contentTypeNotice")
            .text("Content-type error")
            .show();
        }

        // Use email headers if available, otherwise fall back to envelope data
        if (message.from_header) {
          $("#message .metadata dd.from").text(this.formatSender(message.from_header));
        } else {
          $("#message .metadata dd.from").text(this.cleanEmailAddress(message.sender));
        }
        if (message.to_header) {
          // Parse To header which may have multiple recipients
          const toAddresses = message.to_header.split(",").map((email) => this.formatSender(email.trim())).join(", ");
          $("#message .metadata dd.to").text(toAddresses);
        } else {
          $("#message .metadata dd.to").text((message.recipients || []).map((email) => this.cleanEmailAddress(email)).join(", "));
        }
        $("#message .metadata dd.subject").text(message.subject);
        $("#message .views .tab.format").each((i, el) => {
          const $el = $(el);
          const format = $el.attr("data-message-format");

          // Special handling for transcript tab - always show it since all messages have transcripts
          if (format === "transcript") {
            $el.show();
          } else if ($.inArray(format, message.formats) >= 0) {
            $el.find("a").attr("href", this.buildMessageUrl(id, format));
            $el.show();
          } else {
            $el.hide();
          }
        });

        if ($("#message .views .tab.selected:not(:visible)").length) {
          $("#message .views .tab.selected").removeClass("selected");
          const $fallbackTab = hasRenderableBody
            ? $("#message .views .tab:visible:first")
            : $("#message .views .tab.source:visible:first");
          if ($fallbackTab.length) {
            $fallbackTab.addClass("selected");
          }
        }

        if (message.attachments.length) {
          const $ul = $(".attachments-list").empty();

          $.each(message.attachments, (i, attachment) => {
            const $li = $("<li/>");
            const $a = $("<a/>").attr("href", this.buildMessagePartUrl(id, attachment["cid"])).addClass(attachment["type"].split("/", 1)[0]).addClass(attachment["type"].replace("/", "-")).text(attachment["filename"]);
            const $meta = $("<div/>").addClass("attachment-meta");
            $meta.append($("<div/>").addClass("attachment-size").text(this.formatSize(attachment["size"])));
            $meta.append($("<div/>").addClass("attachment-type").text(attachment["type"]));
            $li.append($a).append($meta);
            $ul.append($li);
          });
          $(".attachments-column").addClass("visible");
        } else {
          $(".attachments-column").removeClass("visible");
        }

        $("#message .views .download a").attr("href", this.buildMessageUrl(id, "eml"));

        this.loadAccessibilityScore(id);
        this.loadMessageBody();
      });
    }
  }

  loadAccessibilityScore(id) {
    $.getJSON(this.buildMessagePathUrl(id, "accessibility.json"), (data) => {
      // Update accessibility score
      $("#accessibilityScore").text(data.score);

      // Update breakdown metrics
      if (data.breakdown) {
        $("#imagesWithAlt").text(data.breakdown.images_with_alt + "%");
        $("#semanticHtml").text(data.breakdown.semantic_html + "%");
        $("#linksWithText").text(data.breakdown.links_with_text + "%");
      }

      // Initialize Tippy tooltips with detailed findings
      this.initAccessibilityTooltips(data);
    }).fail(() => {
      // Reset scores if API call fails (e.g., for plain text emails)
      $("#accessibilityScore").text("-");
      $("#imagesWithAlt").text("-");
      $("#semanticHtml").text("-");
      $("#linksWithText").text("-");
    });
  }

  initAccessibilityTooltips(data) {
    // Main accessibility score tooltip
    tippy("#accessibilityScoreBtn", {
      content: this.buildAccessibilityTooltip(data),
      allowHTML: true,
      interactive: true,
      theme: 'light',
      placement: 'bottom',
      maxWidth: 400,
      sticky: true
    });

    // Images with alt text tooltip
    if (data.findings && data.findings.images) {
      tippy("#imagesWithAltBtn", {
        content: this.buildImagesTooltiip(data.findings.images),
        allowHTML: true,
        interactive: true,
        theme: 'light',
        placement: 'bottom',
        maxWidth: 400,
        sticky: true
      });
    }

    // Semantic HTML tooltip
    if (data.findings && data.findings.semantic) {
      tippy("#semanticHtmlBtn", {
        content: this.buildSemanticTooltip(data.findings.semantic),
        allowHTML: true,
        interactive: true,
        theme: 'light',
        placement: 'bottom',
        maxWidth: 400,
        sticky: true
      });
    }

    // Links with text tooltip
    if (data.findings && data.findings.links) {
      tippy("#linksWithTextBtn", {
        content: this.buildLinksTooltip(data.findings.links),
        allowHTML: true,
        interactive: true,
        theme: 'light',
        placement: 'bottom',
        maxWidth: 400,
        sticky: true
      });
    }
  }

  buildAccessibilityTooltip(data) {
    let html = `<div class="accessibility-tooltip">
      <h4>Overall Accessibility Score: ${data.score}/100</h4>`;

    if (data.recommendations && data.recommendations.length) {
      html += `<div class="tooltip-section">
        <h5>Recommendations:</h5>
        <ul>`;
      data.recommendations.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += `</ul></div>`;
    }

    html += `</div>`;
    return html;
  }

  buildImagesTooltiip(findings) {
    let html = `<div class="accessibility-tooltip">
      <h4>Image Accessibility</h4>
      <div class="tooltip-stats">
        <div><strong>Total images:</strong> ${findings.total}</div>
        <div><strong>With alt text:</strong> ${findings.with_alt}</div>
        <div><strong>Missing alt text:</strong> ${findings.total - findings.with_alt}</div>
      </div>`;

    if (findings.without_alt && findings.without_alt.length > 0) {
      html += `<div class="tooltip-section">
        <h5>Images without alt text:</h5>
        <ul class="tooltip-issues">`;
      findings.without_alt.slice(0, 5).forEach(img => {
        html += `<li>${img.alt_missing ? '❌ Missing alt attribute' : '⚠️ Empty alt text'}: ${img.src || '(no src)'}</li>`;
      });
      if (findings.without_alt.length > 5) {
        html += `<li>... and ${findings.without_alt.length - 5} more</li>`;
      }
      html += `</ul></div>`;
    }

    html += `</div>`;
    return html;
  }

  buildSemanticTooltip(findings) {
    let html = `<div class="accessibility-tooltip">
      <h4>Semantic HTML</h4>`;

    if (findings.has_semantic_tags) {
      html += `<div class="tooltip-stats">
        <div>✅ Semantic tags found</div>`;
      if (findings.found_tags && findings.found_tags.length) {
        html += `<div><strong>Tags:</strong> ${findings.found_tags.join(', ')}</div>`;
      }
      html += `</div>`;
    } else {
      html += `<div class="tooltip-stats">
        <div>⚠️ No semantic HTML tags found</div>
        <div style="margin-top: 8px; font-size: 12px;">Consider using semantic tags like:</div>
        <ul class="tooltip-tips">
          <li>&lt;header&gt; - Page header</li>
          <li>&lt;nav&gt; - Navigation area</li>
          <li>&lt;main&gt; - Main content</li>
          <li>&lt;article&gt; - Article content</li>
          <li>&lt;section&gt; - Content section</li>
          <li>&lt;footer&gt; - Page footer</li>
        </ul>
      </div>`;
    }

    html += `</div>`;
    return html;
  }

  buildLinksTooltip(findings) {
    let html = `<div class="accessibility-tooltip">
      <h4>Link Accessibility</h4>
      <div class="tooltip-stats">
        <div><strong>Total links:</strong> ${findings.total}</div>
        <div><strong>With descriptive text:</strong> ${findings.with_text}</div>
        <div><strong>Missing text/aria-label:</strong> ${findings.total - findings.with_text}</div>
      </div>`;

    if (findings.without_text && findings.without_text.length > 0) {
      html += `<div class="tooltip-section">
        <h5>Links without descriptive text:</h5>
        <ul class="tooltip-issues">`;
      findings.without_text.slice(0, 5).forEach(link => {
        html += `<li>${link.text_empty ? '❌ No text' : '⚠️ No aria-label'}: ${link.href || '(no href)'}</li>`;
      });
      if (findings.without_text.length > 5) {
        html += `<li>... and ${findings.without_text.length - 5} more</li>`;
      }
      html += `</ul></div>`;
    }

    html += `</div>`;
    return html;
  }

  loadMessageBody(id, format) {
    id = id || this.selectedMessage();
    format = format || $("#message .views .tab.format.selected").attr("data-message-format");
    format = format || "html";

    $(`#message .views .tab[data-message-format="${format}"]:not(.selected)`).addClass("selected");
    $(`#message .views .tab:not([data-message-format="${format}"]).selected`).removeClass("selected");

    if (id != null) {
      $("#message iframe").attr("src", this.buildMessageUrl(id, format));
    }
  }

  decorateMessageBody() {
    const format = $("#message .views .tab.format.selected").attr("data-message-format");

    switch (format) {
      case "html":
        const body = $("#message iframe").contents().find("body");
        $("a", body).attr("target", "_blank");
        break;
      case "plain":
        const message_iframe = $("#message iframe").contents();

        // Get the plain text content
        let text = message_iframe.text();

        // Escape HTML special characters
        text = text.replace(/&/g, "&amp;");
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/"/g, "&quot;");

        // Convert URLs to clickable links
        text = text.replace(/(https?:\/\/[^\s<>"{}|\\^`\[\]]*)/g, `<a href="$1" target="_blank">$1</a>`);

        // Build the HTML with styling applied directly to body
        const html = `<body style="font-family: 'Monaco', 'Courier New', 'Consolas', monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; background-color: #f5f5f5; padding: 20px 28px; margin: 0; color: #333333;">${text}</body>`;

        // Replace iframe content
        message_iframe.find("html").html(html);
        break;
      case "source":
        const source_iframe = $("#message iframe").contents();
        const source_body = source_iframe.find("body");

        // Get the raw source content
        if (source_body.length) {
          const content = source_body.text();
          if (content) {
            // Escape HTML entities for display
            const escapedContent = content
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");

            // Create syntax-highlighted code block
            const highlightedHtml = `<pre><code class="language-xml">${escapedContent}</code></pre>`;

            // Build the page with proper styling
            const sourceHtml = `
              <body style="background: #f5f5f5; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; padding: 0; margin: 0; line-height: 1.6;">
                <div style="padding: 20px 28px;">
                  ${highlightedHtml}
                </div>
              </body>
            `;

            source_iframe.find("html").html(sourceHtml);

            // Apply syntax highlighting after content is rendered
            setTimeout(() => {
              source_iframe.find("code").each((i, block) => {
                hljs.highlightElement(block);
              });
            }, 0);
          }
        }
        break;
    }
  }

  refresh() {
    $.getJSON("messages", (messages) => {
      $.each(messages, (i, message) => {
        if (!this.haveMessage(message)) {
          this.addMessage(message);
        }
      });
      this.updateMessagesCount();
    });
  }

  subscribe() {
    if (typeof WebSocket !== "undefined" && WebSocket !== null) {
      this.subscribeWebSocket();
    } else {
      this.subscribePoll();
    }
  }

  reconnectWebSocketAttempts = 0;
  maxReconnectAttempts = 10;
  reconnectBaseDelay = 1000;  // 1 second
  connectionTimeoutMs = 5000;  // 5 seconds to establish connection
  pollingRetryIntervalMs = 15000;  // 15 seconds - retry WebSocket while polling
  connectionTimeoutHandle = null;
  pollingRetryTimer = null;

  subscribeWebSocket() {
    const secure = window.location.protocol === "https:";
    const url = new URL("messages", document.baseURI);
    url.protocol = secure ? "wss" : "ws";
    this.websocket = new WebSocket(url.toString());

    // Set timeout to detect if connection hangs during handshake
    this.connectionTimeoutHandle = setTimeout(() => {
      console.warn("[MailCatcher] WebSocket connection timeout - no response within " + this.connectionTimeoutMs + "ms");
      if (this.websocket) {
        this.websocket.close();
      }
    }, this.connectionTimeoutMs);

    this.websocket.onopen = () => {
      console.log("[MailCatcher] WebSocket connection established");
      clearTimeout(this.connectionTimeoutHandle);
      this.connectionTimeoutHandle = null;
      this.reconnectWebSocketAttempts = 0;
      this.updateWebSocketStatus(true);
      // Clear any polling interval since we're back on WebSocket
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
      // Clear polling retry timer
      if (this.pollingRetryTimer) {
        clearInterval(this.pollingRetryTimer);
        this.pollingRetryTimer = null;
      }
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[MailCatcher] WebSocket message received:", data);
        if (data.type === "ping") {
          // Respond to server ping with pong
          console.log("[MailCatcher] Received ping, sending pong");
          this.websocket.send(JSON.stringify({ type: "pong" }));
        } else if (data.type === "add") {
          this.addMessage(data.message);
        } else if (data.type === "remove") {
          this.removeMessage(data.id);
        } else if (data.type === "clear") {
          this.clearMessages();
        } else if (data.type === "quit" && !this.quitting) {
          this.hasQuit();
        }
      } catch (e) {
        console.error("[MailCatcher] Error processing WebSocket message:", e);
      }
    };

    this.websocket.onerror = (event) => {
      console.error("[MailCatcher] WebSocket error:", event);
      clearTimeout(this.connectionTimeoutHandle);
      this.connectionTimeoutHandle = null;
      this.updateWebSocketStatus(false);
    };

    this.websocket.onclose = () => {
      console.log("[MailCatcher] WebSocket connection closed");
      clearTimeout(this.connectionTimeoutHandle);
      this.connectionTimeoutHandle = null;
      this.updateWebSocketStatus(false);
      this.attemptWebSocketReconnect();
    };
  }

  subscribePoll() {
    if (!this.refreshInterval) {
      console.log("[MailCatcher] Starting polling mode (1s interval)");
      this.refreshInterval = setInterval(() => this.refresh(), 1000);
    }
    // Start periodic attempt to reconnect to WebSocket while in polling mode
    if (!this.pollingRetryTimer) {
      console.log("[MailCatcher] Starting WebSocket retry timer (" + this.pollingRetryIntervalMs + "ms interval)");
      this.pollingRetryTimer = setInterval(() => {
        console.log("[MailCatcher] Attempting to reconnect to WebSocket from polling mode");
        // Reset the reconnect attempt counter to try WebSocket again
        this.reconnectWebSocketAttempts = 0;
        this.subscribeWebSocket();
      }, this.pollingRetryIntervalMs);
    }
  }

  attemptWebSocketReconnect() {
    if (this.reconnectWebSocketAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectBaseDelay * Math.pow(2, this.reconnectWebSocketAttempts);
      this.reconnectWebSocketAttempts++;
      console.log(`[MailCatcher] Attempting WebSocket reconnection in ${delay}ms (attempt ${this.reconnectWebSocketAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.subscribeWebSocket(), delay);
    } else {
      console.log("[MailCatcher] Max WebSocket reconnection attempts reached, switching to polling mode with periodic WebSocket retry");
      this.subscribePoll();
    }
  }

  resizeToSavedKey = "mailcatcherSeparatorHeight";

  resizeTo(height) {
    $("#messages").css({
      height: height - $("#messages").offset().top
    });
    if (typeof window.localStorage !== "undefined" && window.localStorage !== null) {
      window.localStorage.setItem(this.resizeToSavedKey, height);
    }
  }

  resizeToSaved() {
    let height = null;
    if (typeof window.localStorage !== "undefined" && window.localStorage !== null) {
      height = parseInt(window.localStorage.getItem(this.resizeToSavedKey));
    }
    if (!isNaN(height)) {
      this.resizeTo(height);
    }
  }

  updateWebSocketStatus(connected) {
    const badge = document.getElementById("websocketStatus");
    const statusText = document.getElementById("statusText");
    if (badge && statusText) {
      if (connected) {
        badge.classList.remove("disconnected");
        statusText.textContent = "Connected";
      } else {
        badge.classList.add("disconnected");
        statusText.textContent = "Disconnected";
      }
    }
  }

  hasQuit() {
    // Server has quit, stay on current page
    console.log("[MailCatcher] Server has quit");
  }

  checkForUpdates() {
    const versionNotification = document.getElementById("versionNotification");
    const versionNotificationText = document.getElementById("versionNotificationText");

    if (!versionNotification || !versionNotificationText) {
      return;
    }

    // Parse current version from the page - get text before the first newline
    const versionBadge = document.querySelector(".version-badge");
    if (!versionBadge) {
      return;
    }

    // Get all text nodes in the version badge and find the first non-whitespace text
    let currentVersion = null;
    for (let node of versionBadge.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          currentVersion = text;
          break;
        }
      }
    }

    if (!currentVersion) {
      return;
    }

    // Normalize version (remove 'v' prefix if present)
    currentVersion = currentVersion.replace(/^v/, "");

    // Semantic version comparison function
    const compareVersions = (v1, v2) => {
      const parts1 = v1.split('.').map(p => parseInt(p, 10));
      const parts2 = v2.split('.').map(p => parseInt(p, 10));

      for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
      }
      return 0;
    };

    // Fetch latest version from GitHub API
    fetch("https://api.github.com/repos/spaquet/mailcatcher/releases/latest", {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch latest version");
      }
      return response.json();
    })
    .then(data => {
      if (!data.tag_name) {
        throw new Error("Invalid release data");
      }

      // Extract version number (remove 'v' prefix if present)
      const latestVersion = data.tag_name.replace(/^v/, "");

      // Compare versions using semantic versioning
      const comparison = compareVersions(latestVersion, currentVersion);

      const icon = versionNotification.querySelector(".version-notification-icon");

      if (comparison > 0) {
        // Update available
        versionNotification.className = "version-notification update-available";
        versionNotificationText.textContent = `Update available: v${latestVersion}`;
        versionNotification.href = data.html_url;
        versionNotification.target = "_blank";
        versionNotification.title = `Click to download v${latestVersion}`;
        versionNotification.style.display = "inline-flex";
        if (icon) icon.style.display = "none";
      } else {
        // On latest version or newer
        versionNotification.className = "version-notification latest-version";
        versionNotificationText.textContent = "latest version";
        versionNotification.style.display = "inline-flex";
        versionNotification.href = "#";
        versionNotification.style.cursor = "default";
        versionNotification.style.pointerEvents = "none";
        versionNotification.onclick = (e) => e.preventDefault();
        if (icon) icon.style.display = "inline-block";
      }
    })
    .catch(error => {
      // Silently fail - don't show anything if we can't fetch the latest version
    });
  }
}

// Initialize MailCatcher on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.MailCatcher = new MailCatcher();
  });
} else {
  // DOM is already loaded
  window.MailCatcher = new MailCatcher();
}
