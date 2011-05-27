var MailCatcher = {
  init: function() {
    $('#mail tr').live('click', function() {
      MailCatcher.load($(this).attr('data-message-id'));
    });

    $('#message .actions ul li.tab').live('click', function() {
      MailCatcher.loadBody($('#mail tr.selected').attr('data-message-id'), $(this).attr('data-message-format'));
    });

    MailCatcher.refresh();
    
    MailCatcher.subscribe();
  },
  
  addMessage: function(message) {
    $('#mail tbody').append(
      $('<tr />').attr('data-message-id', message.id.toString())
        .append($('<td/>').text(message.sender))
        .append($('<td/>').text((message.recipients || []).join(', ')))
        .append($('<td/>').text(message.subject))
        .append($('<td/>').text((new Date(message.created_at)).toString("dddd, d MMM yyyy h:mm:ss tt")))
    );
  },
  
  refresh: function() {
    $.getJSON('/messages', function(mail) {
      $.each(mail, function(i, message) {
        MailCatcher.addMessage(message);
      });
    });
  },
  
  subscribe: function () {
    if (WebSocket !== undefined) {
      MailCatcher.websocket = new WebSocket("ws" + (window.location.scheme == 'https' ? 's' : '') + "://" + window.location.host + "/messages");
      MailCatcher.websocket.onmessage = function (event) {
        MailCatcher.addMessage($.parseJSON(event.data));
      };
    } else {
      if (!MailCatcher.refreshInterval) {
        MailCatcher.refreshInterval = setInterval(MailCatcher.refresh, 30000);
      }
    }
  },
  
  load: function(id) {
    id = id || $('#mail tr.selected').attr('data-message-id');
    
    if (id !== null) {
      $('#mail tbody tr:not([data-message-id="'+id+'"])').removeClass('selected');
      $('#mail tbody tr[data-message-id="'+id+'"]').addClass('selected');
      
      $.getJSON('/messages/' + id + '.json', function(message) {  
        $('#message .received span').text((new Date(message.created_at)).toString("dddd, d MMM yyyy h:mm:ss tt"));
        $('#message .from span').text(message.sender);
        $('#message .to span').text((message.recipients || []).join(', '));
        $('#message .subject span').text(message.subject);
        $('#message .actions ul li.format').each(function(i, el) {
          var $el = $(el),
            format = $el.attr('data-message-format');
          if ($.inArray(format, message.formats) >= 0) {
            $el.show();
          } else {
            $el.hide();
          }
        });
        if ($("#message .actions ul li.tab.selected:not(:visible)")) {
          $("#message .actions ul li.tab.selected").removeClass("selected");
          $("#message .actions ul li.tab:visible:first").addClass("selected");
        }
        if (message.attachments.length > 0) {
          $('#message .metadata .attachments ul').empty();
          $.each(message.attachments, function (i, attachment) {
            $('#message .metadata .attachments ul').append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
          });
          $('#message .metadata .attachments').show();
        } else {
          $('#message .metadata .attachments').hide();
        }
        $('#message .actions ul li.download a').attr('href', '/messages/' + id + '.eml');
        MailCatcher.loadBody();
      });
    }
  },
  
  loadBody: function(id, format) {
    id = id || $('#mail tr.selected').attr('data-message-id');
    format = format || $('#message .actions ul li.selected').first().attr('data-message-format') || 'html';
    
    $('#message .actions ul li.tab[data-message-format="'+format+'"]').addClass('selected');
    $('#message .actions ul li.tab:not([data-message-format="'+format+'"])').removeClass('selected');
    
    if (id !== undefined && id !== null) {
      $('#message iframe').attr('src', '/messages/' + id + '.' + format);
    }
  }
};