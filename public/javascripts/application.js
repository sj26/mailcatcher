(function() {
  var MailCatcher;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  MailCatcher = (function() {
    function MailCatcher() {
      $('#mail tr').live('click', __bind(function(e) {
        return this.loadMessage($(e.currentTarget).attr('data-message-id'));
      }, this));
      $('#message .actions ul li.tab').live('click', __bind(function(e) {
        return this.loadMessageBody($('#mail tr.selected').attr('data-message-id'), $(e.currentTarget).attr('data-message-format'));
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
      console.log(typeof date);
      if (typeof date === "string") {
        date && (date = this.parseDate(date));
      }
      return date && (date = date.toString("dddd, d MMM yyyy h:mm:ss tt"));
    };
    MailCatcher.prototype.haveMessage = function(message) {
      if (message.id != null) {
        message = message.id;
      }
      return $("#mail tbody tr[data-message-id=\"" + message + "\"]").length > 0;
    };
    MailCatcher.prototype.addMessage = function(message) {
      return $('#mail tbody').append($('<tr />').attr('data-message-id', message.id.toString()).append($('<td/>').text(message.sender)).append($('<td/>').text((message.recipients || []).join(', '))).append($('<td/>').text(message.subject)).append($('<td/>').text(this.formatDate(message.created_at))));
    };
    MailCatcher.prototype.loadMessage = function(id) {
      if ((id != null ? id.id : void 0) != null) {
        id = id.id;
      }
      id || (id = $('#mail tr.selected').attr('data-message-id'));
      if (id != null) {
        $('#mail tbody tr:not([data-message-id="' + id + '"])').removeClass('selected');
        $('#mail tbody tr[data-message-id="' + id + '"]').addClass('selected');
        return $.getJSON('/messages/' + id + '.json', __bind(function(message) {
          $('#message .received span').text(this.formatDate(message.created_at));
          $('#message .from span').text(message.sender);
          $('#message .to span').text((message.recipients || []).join(', '));
          $('#message .subject span').text(message.subject);
          $('#message .actions ul li.format').each(function(i, el) {
            var $el, format;
            $el = $(el);
            format = $el.attr('data-message-format');
            if ($.inArray(format, message.formats) >= 0) {
              return $el.show();
            } else {
              return $el.hide();
            }
          });
          if ($("#message .actions ul li.tab.selected:not(:visible)").count) {
            $("#message .actions ul li.tab.selected").removeClass("selected");
            $("#message .actions ul li.tab:visible:first").addClass("selected");
          }
          if (message.attachments.length) {
            $('#message .metadata .attachments ul').empty();
            $.each(message.attachments, function(i, attachment) {
              return $('#message .metadata .attachments ul').append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
            });
            $('#message .metadata .attachments').show();
          } else {
            $('#message .metadata .attachments').hide();
          }
          $('#message .actions ul li.download a').attr('href', "/messages/" + id + ".eml");
          return this.loadMessageBody();
        }, this));
      }
    };
    MailCatcher.prototype.loadMessageBody = function(id, format) {
      id || (id = $('#mail tr.selected').attr('data-message-id'));
      format || (format = $('#message .actions ul li.selected').first().attr('data-message-format'));
      format || (format = 'html');
      $("#message .actions ul li.tab[data-message-format=\"" + format + "\"]").addClass('selected');
      $("#message .actions ul li.tab:not([data-message-format=\"" + format + "\"])").removeClass('selected');
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
