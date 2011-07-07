class MailCatcher
  constructor: ->
    $('#messages tr').live 'click', (e) =>
      @loadMessage $(e.currentTarget).attr 'data-message-id'

    $('#message .views .tab').live 'click', (e) =>
      @loadMessageBody $('#messages tr.selected').attr('data-message-id'), $(e.currentTarget).attr 'data-message-format'

    $('#resizer').live
      mousedown: (e) ->
        e.preventDefault()
        $(window).bind events =
          mouseup: (e) ->
            e.preventDefault()
            $(window).unbind events
          mousemove: (e) ->
            e.preventDefault()
            $('#messages').css
              height: e.clientY - $('#messages').offset().top

    $('nav.app .clear a').live 'click', (e) =>
      if confirm "You will lose all your received messages.\n\nAre you sure you want to clear all messages?"
        $.ajax
          url: '/messages'
          type: 'DELETE'
          success: ->
            $('#messages tbody, #message .metadata dd').empty()
            $('#message .metadata .attachments').hide()
            $('#message iframe').attr 'src', 'about:blank'
          error: ->
            alert 'Error while quitting.'

    $('nav.app .quit a').live 'click', (e) =>
      if confirm "You will lose all your received messages.\n\nAre you sure you want to quit?"
        $.ajax
          type: 'DELETE'
          success: ->
            location.replace $('body > header h1 a').attr('href')
          error: ->
            alert 'Error while quitting.'

    @refresh()
    @subscribe()

  # Only here because Safari's Date parsing *sucks*
  # We throw away the timezone, but you could use it for something...
  parseDateRegexp: /^(\d{4})[-\/\\](\d{2})[-\/\\](\d{2})(?:\s+|T)(\d{2})[:-](\d{2})[:-](\d{2})(?:([ +-]\d{2}:\d{2}|\s*\S+|Z?))?$/
  parseDate: (date) ->
    if match = @parseDateRegexp.exec(date)
      new Date match[1], match[2], match[3], match[4], match[5], match[6], 0

  formatDate: (date) ->
    date &&= @parseDate(date) if typeof(date) == "string"
    date &&= date.toString("dddd, d MMM yyyy h:mm:ss tt")

  haveMessage: (message) ->
    message = message.id if message.id?
    $("#messages tbody tr[data-message-id=\"#{message}\"]").length > 0

  addMessage: (message) ->
    $('#messages tbody').append \
      $('<tr />').attr('data-message-id', message.id.toString())
        .append($('<td/>').text(message.sender or "No sender").toggleClass("blank", !message.sender))
        .append($('<td/>').text((message.recipients || []).join(', ') or "No receipients").toggleClass("blank", !message.recipients.length))
        .append($('<td/>').text(message.subject or "No subject").toggleClass("blank", !message.subject))
        .append($('<td/>').text @formatDate message.created_at)

  loadMessage: (id) ->
    id = id.id if id?.id?
    id ||= $('#messages tr.selected').attr 'data-message-id'

    if id?
      $('#messages tbody tr:not([data-message-id="'+id+'"])').removeClass 'selected'
      $('#messages tbody tr[data-message-id="'+id+'"]').addClass 'selected'

      $.getJSON '/messages/' + id + '.json', (message) =>
        $('#message .metadata dd.created_at').text @formatDate message.created_at
        $('#message .metadata dd.from').text message.sender
        $('#message .metadata dd.to').text (message.recipients || []).join(', ')
        $('#message .metadata dd.subject').text message.subject
        $('#message .views .tab.format').each (i, el) ->
          $el = $(el)
          format = $el.attr 'data-message-format'
          if $.inArray(format, message.formats) >= 0
            $el.show()
          else
            $el.hide()

        if $("#message .views .tab.selected:not(:visible)").length
          $("#message .views .tab.selected").removeClass "selected"
          $("#message .views .tab:visible:first").addClass "selected"

        if message.attachments.length
          $('#message .metadata dd.attachments ul').empty()
          $.each message.attachments, (i, attachment) ->
            $('#message .metadata dd.attachments ul').append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
          $('#message .metadata .attachments').show()
        else
          $('#message .metadata .attachments').hide()

        $('#message .views .download a').attr 'href', "/messages/#{id}.eml"

        @loadMessageBody()

  loadMessageBody: (id, format) ->
    id ||= $('#messages tr.selected').attr 'data-message-id'
    format ||= $('#message .views .tab.format.selected').attr 'data-message-format'
    format ||= 'html'

    $("#message .views .tab[data-message-format=\"#{format}\"]:not(.selected)").addClass 'selected'
    $("#message .views .tab:not([data-message-format=\"#{format}\"]).selected").removeClass 'selected'

    if id?
      $('#message iframe').attr "src", "/messages/#{id}.#{format}"

  refresh: ->
    $.getJSON '/messages', (messages) =>
      $.each messages, (i, message) =>
        unless @haveMessage message
          @addMessage message

  subscribe: ->
    if WebSocket?
      @subscribeWebSocket()
    else
      @subscribePoll()

  subscribeWebSocket: ->
    secure = window.location.scheme == 'https'
    @websocket = new WebSocket("#{if secure then 'wss' else 'ws'}://#{window.location.host}/messages");
    @websocket.onmessage = (event) =>
      @addMessage $.parseJSON event.data

  subscribePoll: ->
    unless @refreshInterval?
      @refreshInterval = setInterval (=> @refresh()), 1000


$ -> window.MailCatcher = new MailCatcher
