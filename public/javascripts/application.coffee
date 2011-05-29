class MailCatcher
  constructor: ->
    $('#mail tr').live 'click', (e) =>
      @loadMessage $(e.currentTarget).attr 'data-message-id'

    $('#message .actions ul li.tab').live 'click', (e) =>
      @loadMessageBody $('#mail tr.selected').attr('data-message-id'), $(e.currentTarget).attr 'data-message-format'

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
    $("#mail tbody tr[data-message-id=\"#{message}\"]").length > 0
    
  addMessage: (message) ->
    $('#mail tbody').append \
      $('<tr />').attr('data-message-id', message.id.toString())
        .append($('<td/>').text(message.sender))
        .append($('<td/>').text((message.recipients || []).join(', ')))
        .append($('<td/>').text(message.subject))
        .append($('<td/>').text @formatDate message.created_at)
  
  loadMessage: (id) ->
    id = id.id if id?.id?
    id ||= $('#mail tr.selected').attr 'data-message-id'
  
    if id?
      $('#mail tbody tr:not([data-message-id="'+id+'"])').removeClass 'selected'
      $('#mail tbody tr[data-message-id="'+id+'"]').addClass 'selected'
    
      $.getJSON '/messages/' + id + '.json', (message) =>
        $('#message .received span').text @formatDate message.created_at
        $('#message .from span').text message.sender
        $('#message .to span').text (message.recipients || []).join(', ')
        $('#message .subject span').text message.subject
        $('#message .actions ul li.format').each (i, el) ->
          $el = $(el)
          format = $el.attr 'data-message-format'
          if $.inArray(format, message.formats) >= 0
            $el.show()
          else
            $el.hide()
      
        if $("#message .actions ul li.tab.selected:not(:visible)").length
          $("#message .actions ul li.tab.selected").removeClass "selected"
          $("#message .actions ul li.tab:visible:first").addClass "selected"
        
        if message.attachments.length
          $('#message .metadata .attachments ul').empty()
          $.each message.attachments, (i, attachment) ->
            $('#message .metadata .attachments ul').append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
          $('#message .metadata .attachments').show()
        else
          $('#message .metadata .attachments').hide()
        
        $('#message .actions ul li.download a').attr 'href', "/messages/#{id}.eml"
      
        @loadMessageBody()

  loadMessageBody: (id, format) ->
    id ||= $('#mail tr.selected').attr 'data-message-id'
    format ||= $('#message .actions ul li.format.selected').attr 'data-message-format'
    format ||= 'html'
  
    $("#message .actions ul li.tab[data-message-format=\"#{format}\"]:not(.selected)").addClass 'selected'
    $("#message .actions ul li.tab:not([data-message-format=\"#{format}\"]).selected").removeClass 'selected'
  
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