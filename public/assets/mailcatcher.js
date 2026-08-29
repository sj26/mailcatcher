"use strict";

// Add a case-insensitive :contains selector to jQuery.
jQuery.expr.pseudos.icontains = (element, _index, match) => {
  const text = element.textContent || element.innerText || "";
  return text.toUpperCase().includes(match[3].toUpperCase());
};

const parseDateRegexp = /^(\d{4})[-\/\\](\d{2})[-\/\\](\d{2})(?:\s+|T)(\d{2})[:-](\d{2})[:-](\d{2})(?:([ +-]\d{2}:\d{2}|\s*\S+|Z?))?$/;

class MailCatcherApp {
  constructor() {
    this.resizeToSavedKey = "mailcatcherSeparatorHeight";

    $("#messages").on("click", "tr", (event) => {
      event.preventDefault();
      this.loadMessage($(event.currentTarget).attr("data-message-id"));
    });

    $("input[name=search]").on("keyup", (event) => {
      const query = $(event.currentTarget).val().trim();
      if (query) {
        this.searchMessages(query);
      } else {
        this.clearSearch();
      }
    });

    $("#message").on("click", ".views .format.tab a", (event) => {
      event.preventDefault();
      const format = $(event.currentTarget).parent("li").data("message-format");
      this.loadMessageBody(this.selectedMessage(), format);
    });

    $("#message iframe").on("load", () => {
      this.decorateMessageBody();
    });

    $("#resizer").on("mousedown", (event) => {
      event.preventDefault();
      const events = {
        mouseup: (mouseEvent) => {
          mouseEvent.preventDefault();
          $(window).off(events);
        },
        mousemove: (mouseEvent) => {
          mouseEvent.preventDefault();
          this.resizeTo(mouseEvent.clientY);
        },
      };
      $(window).on(events);
    });

    this.resizeToSaved();

    $("nav.app .clear a").on("click", (event) => {
      event.preventDefault();
      if (confirm("You will lose all your received messages.\n\nAre you sure you want to clear all messages?")) {
        $.ajax({
          url: new URL("messages", document.baseURI).toString(),
          type: "DELETE",
          success: () => {
            this.clearMessages();
          },
          error: () => {
            alert("Error while clearing all messages.");
          },
        });
      }
    });

    $("nav.app .quit a").on("click", (event) => {
      event.preventDefault();
      if (confirm("You will lose all your received messages.\n\nAre you sure you want to quit?")) {
        this.quitting = true;
        $.ajax({
          type: "DELETE",
          success: () => {
            this.hasQuit();
          },
          error: () => {
            this.quitting = false;
            alert("Error while quitting.");
          },
        });
      }
    });

    this.favcount = new Favcount($("link[rel=icon]").attr("href"));

    key("up", () => {
      if (this.selectedMessage()) {
        this.loadMessage($("#messages tr.selected").prevAll(":visible").first().data("message-id"));
      } else {
        this.loadMessage($("#messages tbody tr[data-message-id]").first().data("message-id"));
      }
      return false;
    });

    key("down", () => {
      if (this.selectedMessage()) {
        this.loadMessage($("#messages tr.selected").nextAll(":visible").first().data("message-id"));
      } else {
        this.loadMessage($("#messages tbody tr[data-message-id]").first().data("message-id"));
      }
      return false;
    });

    key("⌘+up, ctrl+up", () => {
      this.loadMessage($("#messages tbody tr[data-message-id]:visible").first().data("message-id"));
      return false;
    });

    key("⌘+down, ctrl+down", () => {
      this.loadMessage($("#messages tbody tr[data-message-id]:visible").last().data("message-id"));
      return false;
    });

    key("left", () => {
      this.openTab(this.previousTab());
      return false;
    });

    key("right", () => {
      this.openTab(this.nextTab());
      return false;
    });

    key("backspace, delete", () => {
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
          },
        });
      }
      return false;
    });

    this.refresh();
    this.subscribe();
  }

  // Safari cannot reliably parse the server's date format.
  parseDate(date) {
    const match = parseDateRegexp.exec(date);
    if (match) {
      return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6], 0);
    }
  }

  offsetTimeZone(date) {
    const offset = Date.now().getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - offset);
    return date;
  }

  formatDate(date) {
    if (date && typeof date === "string") {
      date = this.parseDate(date);
    }
    if (date) {
      date = this.offsetTimeZone(date);
    }
    if (date) {
      date = date.toString("dddd, d MMM yyyy h:mm:ss tt");
    }
    return date;
  }

  messagesCount() {
    return $("#messages tr").length - 1;
  }

  updateMessagesCount() {
    const count = this.messagesCount();
    this.favcount.set(count);
    document.title = `MailCatcher (${count})`;
  }

  tabs() {
    return $("#message ul").children(".tab");
  }

  getTab(index) {
    return $(this.tabs()[index]);
  }

  selectedTab() {
    return this.tabs().index($("#message li.tab.selected"));
  }

  openTab(index) {
    this.getTab(index).children("a").click();
  }

  previousTab(tab) {
    let index = tab == null ? this.selectedTab() - 1 : tab;
    if (index < 0) {
      index = this.tabs().length - 1;
    }
    if (this.getTab(index).is(":visible")) {
      return index;
    }
    return this.previousTab(index - 1);
  }

  nextTab(tab) {
    let index = tab == null ? this.selectedTab() + 1 : tab;
    if (index > this.tabs().length - 1) {
      index = 0;
    }
    if (this.getTab(index).is(":visible")) {
      return index;
    }
    return this.nextTab(index + 1);
  }

  haveMessage(message) {
    const id = message.id == null ? message : message.id;
    return $(`#messages tbody tr[data-message-id="${id}"]`).length > 0;
  }

  selectedMessage() {
    return $("#messages tr.selected").data("message-id");
  }

  searchMessages(query) {
    const selector = query.split(/\s+/).map((token) => `:icontains('${token}')`).join("");
    const rows = $("#messages tbody tr");
    rows.not(selector).hide();
    rows.filter(selector).show();
  }

  clearSearch() {
    $("#messages tbody tr").show();
  }

  addMessage(message) {
    const recipients = message.recipients || [];
    $("<tr />").attr("data-message-id", message.id.toString())
      .append($("<td/>").text(message.sender || "No sender").toggleClass("blank", !message.sender))
      .append($("<td/>").text(recipients.join(", ") || "No recipients").toggleClass("blank", recipients.length === 0))
      .append($("<td/>").text(message.subject || "No subject").toggleClass("blank", !message.subject))
      .append($("<td/>").text(this.formatDate(message.created_at)))
      .prependTo($("#messages tbody"));
    this.updateMessagesCount();
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
      return;
    }

    const overflow = relativePosition + row.height() - $("#messages").height();
    if (overflow > 0) {
      $("#messages").scrollTop($("#messages").scrollTop() + overflow + 20);
    }
  }

  unselectMessage() {
    $("#messages tbody, #message .metadata dd").empty();
    $("#message .metadata .attachments").hide();
    $("#message iframe").attr("src", "about:blank");
  }

  loadMessage(id) {
    if (id != null && id.id != null) {
      id = id.id;
    }
    id = id || $("#messages tr.selected").attr("data-message-id");
    if (id == null) {
      return;
    }

    $(`#messages tbody tr:not([data-message-id='${id}'])`).removeClass("selected");
    const messageRow = $(`#messages tbody tr[data-message-id='${id}']`);
    messageRow.addClass("selected");
    this.scrollToRow(messageRow);

    return $.getJSON(`messages/${id}.json`, (message) => {
      $("#message .metadata dd.created_at").text(this.formatDate(message.created_at));
      $("#message .metadata dd.from").text(message.sender);
      $("#message .metadata dd.to").text((message.recipients || []).join(", "));
      $("#message .metadata dd.subject").text(message.subject);

      $("#message .views .tab.format").each((_index, element) => {
        const tab = $(element);
        const format = tab.attr("data-message-format");
        if (message.formats.includes(format)) {
          tab.find("a").attr("href", `messages/${id}.${format}`);
          tab.show();
        } else {
          tab.hide();
        }
      });

      if ($("#message .views .tab.selected:not(:visible)").length) {
        $("#message .views .tab.selected").removeClass("selected");
        $("#message .views .tab:visible:first").addClass("selected");
      }

      if (message.attachments.length) {
        const list = $("<ul/>").appendTo($("#message .metadata dd.attachments").empty());
        message.attachments.forEach((attachment) => {
          const type = attachment.type;
          list.append(
            $("<li>").append(
              $("<a>")
                .attr("href", `messages/${id}/parts/${attachment.cid}`)
                .addClass(type.split("/", 1)[0])
                .addClass(type.replace("/", "-"))
                .text(attachment.filename),
            ),
          );
        });
        $("#message .metadata .attachments").show();
      } else {
        $("#message .metadata .attachments").hide();
      }

      $("#message .views .download a").attr("href", `messages/${id}.eml`);
      this.loadMessageBody();
    });
  }

  loadMessageBody(id, format) {
    id = id || this.selectedMessage();
    format = format || $("#message .views .tab.format.selected").attr("data-message-format") || "html";

    $(`#message .views .tab[data-message-format="${format}"]:not(.selected)`).addClass("selected");
    $(`#message .views .tab:not([data-message-format="${format}"]).selected`).removeClass("selected");

    if (id != null) {
      $("#message iframe").attr("src", `messages/${id}.${format}`);
    }
  }

  decorateMessageBody() {
    const format = $("#message .views .tab.format.selected").attr("data-message-format");

    if (format === "html") {
      const body = $("#message iframe").contents().find("body");
      $("a", body).attr("target", "_blank");
    } else if (format === "plain") {
      const messageIframe = $("#message iframe").contents();
      let text = messageIframe.text();

      // Escape special characters.
      text = text.replace(/&/g, "&amp;");
      text = text.replace(/</g, "&lt;");
      text = text.replace(/>/g, "&gt;");
      text = text.replace(/"/g, "&quot;");

      // Autolink URLs.
      text = text.replace(/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?)/g, '<a href="$1" target="_blank">$1</a>');

      messageIframe.find("html").html(`<body style="font-family: sans-serif; white-space: pre-wrap">${text}</body>`);
    }
  }

  refresh() {
    return $.getJSON("messages", (messages) => {
      messages.forEach((message) => {
        if (!this.haveMessage(message)) {
          this.addMessage(message);
        }
      });
      this.updateMessagesCount();
    });
  }

  subscribe() {
    if (typeof WebSocket === "undefined" || WebSocket === null) {
      this.subscribePoll();
    } else {
      this.subscribeWebSocket();
    }
  }

  subscribeWebSocket() {
    const url = new URL("messages", document.baseURI);
    url.protocol = window.location.protocol === "https:" ? "wss" : "ws";
    this.websocket = new WebSocket(url.toString());
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "add") {
        this.addMessage(data.message);
      } else if (data.type === "remove") {
        this.removeMessage(data.id);
      } else if (data.type === "clear") {
        this.clearMessages();
      } else if (data.type === "quit" && !this.quitting) {
        alert("MailCatcher has been quit");
        this.hasQuit();
      }
    };
  }

  subscribePoll() {
    if (this.refreshInterval == null) {
      this.refreshInterval = setInterval(() => this.refresh(), 1000);
    }
  }

  resizeTo(height) {
    $("#messages").css({
      height: height - $("#messages").offset().top,
    });
    if (window.localStorage) {
      window.localStorage.setItem(this.resizeToSavedKey, height);
    }
  }

  resizeToSaved() {
    const savedHeight = window.localStorage && window.localStorage.getItem(this.resizeToSavedKey);
    const height = parseInt(savedHeight, 10);
    if (!Number.isNaN(height)) {
      this.resizeTo(height);
    }
  }

  hasQuit() {
    location.assign($("body > header h1 a").attr("href"));
  }
}

$(() => {
  window.MailCatcher = new MailCatcherApp();
});
