#= require modernizr
#= require jquery
#= require date
#= require favcount
#= require flexie
#= require keymaster
#= require url

# Add a new jQuery selector expression which does a case-insensitive :contains
jQuery.expr.pseudos.icontains = (a, i, m) ->
  (a.textContent ? a.innerText ? "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0

class MailCatcher
  constructor: ->
    $("#messages").on "click", "tr", (e) =>
      e.preventDefault()
      @loadMessage $(e.currentTarget).attr("data-message-id")

    $("input[name=search]").on "keyup", (e) =>
      query = $.trim $(e.currentTarget).val()
      if query
        @searchMessages query
      else
        @clearSearch()

    $("#message").on "click", ".views .format.tab a", (e) =>
      e.preventDefault()
      @loadMessageBody @selectedMessage(), $($(e.currentTarget).parent("li")).data("message-format")

    $("#message iframe").on "load", =>
      @decorateMessageBody()

    $("#resizer").on "mousedown", (e) =>
      e.preventDefault()
      events =
        mouseup: (e) =>
          e.preventDefault()
          $(window).off(events)
        mousemove: (e) =>
          e.preventDefault()
          @resizeTo e.clientY
      $(window).on(events)

    @resizeToSaved()

    $("nav.app .clear a").on "click", (e) =>
      e.preventDefault()
      if confirm "You will lose all your received messages.\n\nAre you sure you want to clear all messages?"
        $.ajax
          url: new URL("messages", document.baseURI).toString()
          type: "DELETE"
          success: =>
            @clearMessages()
          error: ->
            alert "Error while clearing all messages."

    $("nav.app .quit a").on "click", (e) =>
      e.preventDefault()
      if confirm "You will lose all your received messages.\n\nAre you sure you want to quit?"
        @quitting = true
        $.ajax
          type: "DELETE"
          success: =>
            @hasQuit()
          error: =>
            @quitting = false
            alert "Error while quitting."

    @favcount = new Favcount($("""link[rel="icon"]""").attr("href"))

    key "up", =>
      if @selectedMessage()
        @loadMessage $("#messages tr.selected").prevAll(":visible").first().data("message-id")
      else
        @loadMessage $("#messages tbody tr[data-message-id]").first().data("message-id")
      false

    key "down", =>
      if @selectedMessage()
        @loadMessage $("#messages tr.selected").nextAll(":visible").data("message-id")
      else
        @loadMessage $("#messages tbody tr[data-message-id]:first").data("message-id")
      false

    key "⌘+up, ctrl+up", =>
      @loadMessage $("#messages tbody tr[data-message-id]:visible").first().data("message-id")
      false

    key "⌘+down, ctrl+down", =>
      @loadMessage $("#messages tbody tr[data-message-id]:visible").first().data("message-id")
      false

    key "left", =>
      @openTab @previousTab()
      false

    key "right", =>
      @openTab @nextTab()
      false

    key "backspace, delete", =>
      id = @selectedMessage()
      if id?
        $.ajax
          url: new URL("messages/#{id}", document.baseURI).toString()
          type: "DELETE"
          success: =>
            @removeMessage(id)

          error: ->
            alert "Error while removing message."
      false

    @refresh()
    @subscribe()

  # Only here because Safari's Date parsing *sucks*
  # We throw away the timezone, but you could use it for something...
  parseDateRegexp: /^(\d{4})[-\/\\](\d{2})[-\/\\](\d{2})(?:\s+|T)(\d{2})[:-](\d{2})[:-](\d{2})(?:([ +-]\d{2}:\d{2}|\s*\S+|Z?))?$/
  parseDate: (date) ->
    if match = @parseDateRegexp.exec(date)
      new Date match[1], match[2] - 1, match[3], match[4], match[5], match[6], 0

  offsetTimeZone: (date) ->
    offset = Date.now().getTimezoneOffset() * 60000 #convert timezone difference to milliseconds
    date.setTime(date.getTime() - offset)
    date

  formatDate: (date) ->
    date &&= @parseDate(date) if typeof(date) == "string"
    date &&= @offsetTimeZone(date)
    date &&= date.toString("dddd, d MMM yyyy h:mm:ss tt")

  messagesCount: ->
    $("#messages tr").length - 1

  updateMessagesCount: ->
    @favcount.set(@messagesCount())
    document.title = 'MailCatcher (' + @messagesCount() + ')'

  tabs: ->
    $("#message ul").children(".tab")

  getTab: (i) =>
    $(@tabs()[i])

  selectedTab: =>
    @tabs().index($("#message li.tab.selected"))

  openTab: (i) =>
    @getTab(i).children("a").click()

  previousTab: (tab)=>
    i = if tab || tab is 0 then tab else @selectedTab() - 1
    i = @tabs().length - 1 if i < 0
    if @getTab(i).is(":visible")
      i
    else
      @previousTab(i - 1)

  nextTab: (tab) =>
    i = if tab then tab else @selectedTab() + 1
    i = 0 if i > @tabs().length - 1
    if @getTab(i).is(":visible")
      i
    else
      @nextTab(i + 1)

  haveMessage: (message) ->
    message = message.id if message.id?
    $("""#messages tbody tr[data-message-id="#{message}"]""").length > 0

  selectedMessage: ->
    $("#messages tr.selected").data "message-id"

  searchMessages: (query) ->
    selector = (":icontains('#{token}')" for token in query.split /\s+/).join("")
    $rows = $("#messages tbody tr")
    $rows.not(selector).hide()
    $rows.filter(selector).show()

  clearSearch: ->
    $("#messages tbody tr").show()

  addMessage: (message) ->
    $("<tr />").attr("data-message-id", message.id.toString())
      .append($("<td/>").text(message.sender or "No sender").toggleClass("blank", !message.sender))
      .append($("<td/>").text((message.recipients || []).join(", ") or "No receipients").toggleClass("blank", !message.recipients.length))
      .append($("<td/>").text(message.subject or "No subject").toggleClass("blank", !message.subject))
      .append($("<td/>").text(@formatDate(message.created_at)))
      .prependTo($("#messages tbody"))
    @updateMessagesCount()

  removeMessage: (id) ->
    messageRow = $("""#messages tbody tr[data-message-id="#{id}"]""")
    isSelected = messageRow.is(".selected")
    if isSelected
      switchTo = messageRow.next().data("message-id") || messageRow.prev().data("message-id")
    messageRow.remove()
    if isSelected
      if switchTo
        @loadMessage switchTo
      else
        @unselectMessage()
    @updateMessagesCount()

  clearMessages: ->
    $("#messages tbody tr").remove()
    @unselectMessage()
    @updateMessagesCount()

  scrollToRow: (row) ->
    relativePosition = row.offset().top - $("#messages").offset().top
    if relativePosition < 0
      $("#messages").scrollTop($("#messages").scrollTop() + relativePosition - 20)
    else
      overflow = relativePosition + row.height() - $("#messages").height()
      if overflow > 0
        $("#messages").scrollTop($("#messages").scrollTop() + overflow + 20)

  unselectMessage: ->
    $("#messages tbody, #message .metadata dd").empty()
    $("#message .metadata .attachments").hide()
    $("#message iframe").attr("src", "about:blank")
    null

  loadMessage: (id) ->
    id = id.id if id?.id?
    id ||= $("#messages tr.selected").attr "data-message-id"

    if id?
      $("#messages tbody tr:not([data-message-id='#{id}'])").removeClass("selected")
      messageRow = $("#messages tbody tr[data-message-id='#{id}']")
      messageRow.addClass("selected")
      @scrollToRow(messageRow)

      $.getJSON "messages/#{id}.json", (message) =>
        $("#message .metadata dd.created_at").text(@formatDate message.created_at)
        $("#message .metadata dd.from").text(message.sender)
        $("#message .metadata dd.to").text((message.recipients || []).join(", "))
        $("#message .metadata dd.subject").text(message.subject)
        $("#message .views .tab.format").each (i, el) ->
          $el = $(el)
          format = $el.attr("data-message-format")
          if $.inArray(format, message.formats) >= 0
            $el.find("a").attr("href", "messages/#{id}.#{format}")
            $el.show()
          else
            $el.hide()

        if $("#message .views .tab.selected:not(:visible)").length
          $("#message .views .tab.selected").removeClass("selected")
          $("#message .views .tab:visible:first").addClass("selected")

        if message.attachments.length
          $ul = $("<ul/>").appendTo($("#message .metadata dd.attachments").empty())

          $.each message.attachments, (i, attachment) ->
            $ul.append($("<li>").append($("<a>").attr("href", "messages/#{id}/parts/#{attachment["cid"]}").addClass(attachment["type"].split("/", 1)[0]).addClass(attachment["type"].replace("/", "-")).text(attachment["filename"])))
          $("#message .metadata .attachments").show()
        else
          $("#message .metadata .attachments").hide()

        $("#message .views .download a").attr("href", "messages/#{id}.eml")

        @loadMessageBody()

  loadMessageBody: (id, format) ->
    id ||= @selectedMessage()
    format ||= $("#message .views .tab.format.selected").attr("data-message-format")
    format ||= "html"

    $("""#message .views .tab[data-message-format="#{format}"]:not(.selected)""").addClass("selected")
    $("""#message .views .tab:not([data-message-format="#{format}"]).selected""").removeClass("selected")

    if id?
      $("#message iframe").attr("src", "messages/#{id}.#{format}")

  decorateMessageBody: ->
    format = $("#message .views .tab.format.selected").attr("data-message-format")

    switch format
      when "html"
        body = $("#message iframe").contents().find("body")
        $("a", body).attr("target", "_blank")
      when "plain"
        message_iframe = $("#message iframe").contents()
        text = message_iframe.text()
        text = text.replace(/&/g, "&amp;")
        text = text.replace(/</g, "&lt;")
        text = text.replace(/>/g, "&gt;")
        text = text.replace(/\n/g, "<br/>")
        text = text.replace(/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?)/g, """<a href="$1" target="_blank">$1</a>""")
        message_iframe.find("html").html("<html><body>#{text}</html></body>")

  refresh: ->
    $.getJSON "messages", (messages) =>
      $.each messages, (i, message) =>
        unless @haveMessage message
          @addMessage message
      @updateMessagesCount()

  subscribe: ->
    if WebSocket?
      @subscribeWebSocket()
    else
      @subscribePoll()

  subscribeWebSocket: ->
    secure = window.location.protocol is "https:"
    url = new URL("messages", document.baseURI)
    url.protocol = if secure then "wss" else "ws"
    @websocket = new WebSocket(url.toString())
    @websocket.onmessage = (event) =>
      data = JSON.parse(event.data)
      if data.type == "add"
        @addMessage(data.message)
      else if data.type == "remove"
        @removeMessage(data.id)
      else if data.type == "clear"
        @clearMessages()
      else if data.type == "quit" and not @quitting
        alert "MailCatcher has been quit"
        @hasQuit()

  subscribePoll: ->
    unless @refreshInterval?
      @refreshInterval = setInterval (=> @refresh()), 1000

  resizeToSavedKey: "mailcatcherSeparatorHeight"

  resizeTo: (height) ->
    $("#messages").css
      height: height - $("#messages").offset().top
    window.localStorage?.setItem(@resizeToSavedKey, height)

  resizeToSaved: ->
    height = parseInt(window.localStorage?.getItem(@resizeToSavedKey))
    unless isNaN height
      @resizeTo height

  hasQuit: ->
    location.replace $("body > header h1 a").attr("href")

$ -> window.MailCatcher = new MailCatcher
