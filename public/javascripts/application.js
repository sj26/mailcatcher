var MailCatcher = {
  init: function() {
    $('#mail tr').live('click', function() {
      MailCatcher.load($(this).attr('data-message-id'));
    });

    $('#message .formats ul li').live('click', function() {
      MailCatcher.loadBody($('#mail tr.selected').attr('data-message-id'), $(this).attr('data-message-format'));
    });

    MailCatcher.refresh();
    MailCatcher.subscribe();
  },
  
  addMessage: function(message) {
    var row = $('<tr />').attr('data-message-id', message.id.toString());
    $.each(['sender', 'recipients', 'subject', 'created_at'], function (i, property) {
      row.append($('<td />').text(message[property]));
    });
    $('#mail tbody').append(row);
  },
  
  refresh: function() {
    console.log('Refreshing messages');
    $.getJSON('/messages', function(mail) {
      $.each(mail, function(i, message) {
        MailCatcher.addMessage(message);
      });
    });
  },
  
  subscribe: function () {
    MailCatcher.websocket = new WebSocket("ws" + (window.location.scheme == 'https' ? 's' : '') + "://" + window.location.host + "/messages");
    MailCatcher.websocket.onmessage = function (event) {
      console.log('Message received:', event.data);
      MailCatcher.addMessage($.parseJSON(event.data));
    };
  },
  
  load: function(id) {
    id = id || $('#mail tr.selected').attr('data-message-id');
    
    if (id !== null) {
      console.log('Loading message', id);
    
      $('#mail tbody tr:not([data-message-id="'+id+'"])').removeClass('selected');
      $('#mail tbody tr[data-message-id="'+id+'"]').addClass('selected');
      $.getJSON('/messages/' + id + '.json', function(message) {
        $('#message .received span').text(message.created_at);
        $('#message .from span').text(message.sender);
        $('#message .to span').text(message.recipients);
        $('#message .subject span').text(message.subject);
        $('#message .formats ul li').each(function(i, el) {
          var $el = $(el),
            format = $el.attr('data-message-format');
          if ($.inArray(format, message.formats) >= 0) {
            $el.show();
          } else {
            $el.hide();
          }
        });
        if ($("#message .formats ul li.selected:not(:visible)")) {
          $("#message .formats ul li.selected").removeClass("selected");
          $("#message .formats ul li:visible:first").addClass("selected");
        }
        if (message.attachments.length > 0) {
          console.log(message.attachments);
          $('#message .attachments ul').empty();
          $.each(message.attachments, function (i, attachment) {
            $('#message .attachments ul').append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
          });
          $('#message .attachments').show();
        } else {
          $('#message .attachments').hide();
        }
        MailCatcher.loadBody();
      });
    }
  },
  
  loadBody: function(id, format) {
    id = id || $('#mail tr.selected').attr('data-message-id');
    format = format || $('#message .formats ul li.selected').first().attr('data-message-format') || 'html';
    
    $('#message .formats ul li[data-message-format="'+format+'"]').addClass('selected');
    $('#message .formats ul li:not([data-message-format="'+format+'"])').removeClass('selected');
    
    if (id !== undefined && id !== null) {
      console.log('Loading message', id, 'in format', format);
    
      $('#message iframe').attr('src', '/messages/' + id + '.' + format);
    }
  }
};