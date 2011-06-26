(function() {
  var MailCatcher;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  MailCatcher = (function() {
    function MailCatcher() {
      $('#messages tr').live('click', __bind(function(e) {
        return this.loadMessage($(e.currentTarget).attr('data-message-id'));
      }, this));
      $('#message .views .tab').live('click', __bind(function(e) {
        return this.loadMessageBody($('#messages tr.selected').attr('data-message-id'), $(e.currentTarget).attr('data-message-format'));
      }, this));
      $('nav.app .clear a').live('click', __bind(function(e) {
        if (confirm("You will lose all your received messages.\n\nAre you sure you want to clear all messages?")) {
          return $.ajax({
            url: '/messages',
            type: 'DELETE',
            success: function() {
              $('#messages tbody, #message .metadata dd').empty();
              $('#message .metadata .attachments').hide();
              return $('#message iframe').attr('src', 'about:blank');
            },
            error: function() {
              return alert('Error while quitting.');
            }
          });
        }
      }, this));
      $('nav.app .quit a').live('click', __bind(function(e) {
        if (confirm("You will lose all your received messages.\n\nAre you sure you want to quit?")) {
          return $.ajax({
            type: 'DELETE',
            success: function() {
              return location.replace($('body > header h1 a').attr('href'));
            },
            error: function() {
              return alert('Error while quitting.');
            }
          });
        }
      }, this));
      this.refresh();
      this.subscribe();
    }
    MailCatcher.prototype.parseDateRegexp = /^(\d{4})[-\/\\](\d{2})[-\/\\](\d{2})(?:\s+|T)(\d{2})[:-](\d{2})[:-](\d{2})(?:([ +-]\d{2}:\d{2}|\s*\S+|Z?))?$/;
    MailCatcher.prototype.parseDate = function(date) {
      var match;
      if (match = this.parseDateRegexp.exec(date)) {
        return new Date(match[1], match[2], match[3], match[4], match[5], match[6], 0);
      }
    };
    MailCatcher.prototype.formatDate = function(date) {
      if (typeof date === "string") {
        date && (date = this.parseDate(date));
      }
      return date && (date = date.toString("dddd, d MMM yyyy h:mm:ss tt"));
    };
    MailCatcher.prototype.haveMessage = function(message) {
      if (message.id != null) {
        message = message.id;
      }
      return $("#messages tbody tr[data-message-id=\"" + message + "\"]").length > 0;
    };
    MailCatcher.prototype.addMessage = function(message) {
      return $('#messages tbody').append($('<tr />').attr('data-message-id', message.id.toString()).append($('<td/>').text(message.sender || "No sender").toggleClass("blank", !message.sender)).append($('<td/>').text((message.recipients || []).join(', ') || "No receipients").toggleClass("blank", !message.recipients.length)).append($('<td/>').text(message.subject || "No subject").toggleClass("blank", !message.subject)).append($('<td/>').text(this.formatDate(message.created_at))));
    };
    MailCatcher.prototype.loadMessage = function(id) {
      if ((id != null ? id.id : void 0) != null) {
        id = id.id;
      }
      id || (id = $('#messages tr.selected').attr('data-message-id'));
      if (id != null) {
        $('#messages tbody tr:not([data-message-id="' + id + '"])').removeClass('selected');
        $('#messages tbody tr[data-message-id="' + id + '"]').addClass('selected');
        return $.getJSON('/messages/' + id + '.json', __bind(function(message) {
          $('#message .metadata dd.created_at').text(this.formatDate(message.created_at));
          $('#message .metadata dd.from').text(message.sender);
          $('#message .metadata dd.to').text((message.recipients || []).join(', '));
          $('#message .metadata dd.subject').text(message.subject);
          $('#message .views .tab.format').each(function(i, el) {
            var $el, format;
            $el = $(el);
            format = $el.attr('data-message-format');
            if ($.inArray(format, message.formats) >= 0) {
              return $el.show();
            } else {
              return $el.hide();
            }
          });
          if ($("#message .views .tab.selected:not(:visible)").length) {
            $("#message .views .tab.selected").removeClass("selected");
            $("#message .views .tab:visible:first").addClass("selected");
          }
          if (message.attachments.length) {
            $('#message .metadata dd.attachments ul').empty();
            $.each(message.attachments, function(i, attachment) {
              return $('#message .metadata dd.attachments ul').append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
            });
            $('#message .metadata .attachments').show();
          } else {
            $('#message .metadata .attachments').hide();
          }
          $('#message .views .download a').attr('href', "/messages/" + id + ".eml");
          return this.loadMessageBody();
        }, this));
      }
    };
    MailCatcher.prototype.loadMessageBody = function(id, format) {
      id || (id = $('#messages tr.selected').attr('data-message-id'));
      format || (format = $('#message .views .tab.format.selected').attr('data-message-format'));
      format || (format = 'html');
      $("#message .views .tab[data-message-format=\"" + format + "\"]:not(.selected)").addClass('selected');
      $("#message .views .tab:not([data-message-format=\"" + format + "\"]).selected").removeClass('selected');
      if (id != null) {
        return $('#message iframe').attr("src", "/messages/" + id + "." + format);
      }
    };
    MailCatcher.prototype.refresh = function() {
      return $.getJSON('/messages', __bind(function(messages) {
        return $.each(messages, __bind(function(i, message) {
          if (!this.haveMessage(message)) {
            return this.addMessage(message);
          }
        }, this));
      }, this));
    };
    MailCatcher.prototype.subscribe = function() {
      if (typeof WebSocket !== "undefined" && WebSocket !== null) {
        return this.subscribeWebSocket();
      } else {
        return this.subscribePoll();
      }
    };
    MailCatcher.prototype.subscribeWebSocket = function() {
      var secure;
      secure = window.location.scheme === 'https';
      this.websocket = new WebSocket("" + (secure ? 'wss' : 'ws') + "://" + window.location.host + "/messages");
      return this.websocket.onmessage = __bind(function(event) {
        return this.addMessage($.parseJSON(event.data));
      }, this);
    };
    MailCatcher.prototype.subscribePoll = function() {
      if (this.refreshInterval == null) {
        return this.refreshInterval = setInterval((__bind(function() {
          return this.refresh();
        }, this)), 1000);
      }
    };
    return MailCatcher;
  })();
  $(function() {
    return window.MailCatcher = new MailCatcher;
  });
}).call(this);
