(function() {
  var MailCatcher;

  MailCatcher = (function() {

    function MailCatcher() {
      var _this = this;
      $('#messages tr').live('click', function(e) {
        e.preventDefault();
        return _this.loadMessage($(e.currentTarget).attr('data-message-id'));
      });
      $('input[name=search]').live('keyup', function(e) {
        e.preventDefault();
        console.log(e);
        if (e.currentTarget.value === "") {
          return _this.clearSearch();
        } else {
          return _this.searchMessages(e.currentTarget.value);
        }
      });
      $('#message .views .format.tab a').live('click', function(e) {
        e.preventDefault();
        return _this.loadMessageBody(_this.selectedMessage(), $($(e.currentTarget).parent('li')).data('message-format'));
      });
      $('#message .views .analysis.tab a').live('click', function(e) {
        e.preventDefault();
        return _this.loadMessageAnalysis(_this.selectedMessage());
      });
      $('#resizer').live({
        mousedown: function(e) {
          var events;
          e.preventDefault();
          return $(window).bind(events = {
            mouseup: function(e) {
              e.preventDefault();
              return $(window).unbind(events);
            },
            mousemove: function(e) {
              e.preventDefault();
              return $('#messages').css({
                height: e.clientY - $('#messages').offset().top
              });
            }
          });
        }
      });
      $('nav.app .clear a').live('click', function(e) {
        e.preventDefault();
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
      });
      $('nav.app .quit a').live('click', function(e) {
        e.preventDefault();
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
      });
      this.refresh();
      this.subscribe();
    }

    MailCatcher.prototype.parseDateRegexp = /^(\d{4})[-\/\\](\d{2})[-\/\\](\d{2})(?:\s+|T)(\d{2})[:-](\d{2})[:-](\d{2})(?:([ +-]\d{2}:\d{2}|\s*\S+|Z?))?$/;

    MailCatcher.prototype.parseDate = function(date) {
      var match;
      if (match = this.parseDateRegexp.exec(date)) {
        return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6], 0);
      }
    };

    MailCatcher.prototype.offsetTimeZone = function(date) {
      var offset;
      offset = Date.now().getTimezoneOffset() * 60000;
      date.setTime(date.getTime() - offset);
      return date;
    };

    MailCatcher.prototype.formatDate = function(date) {
      if (typeof date === "string") date && (date = this.parseDate(date));
      date && (date = this.offsetTimeZone(date));
      return date && (date = date.toString("dddd, d MMM yyyy h:mm:ss tt"));
    };

    MailCatcher.prototype.haveMessage = function(message) {
      if (message.id != null) message = message.id;
      return $("#messages tbody tr[data-message-id=\"" + message + "\"]").length > 0;
    };

    MailCatcher.prototype.selectedMessage = function() {
      return $('#messages tr.selected').data('message-id');
    };

    MailCatcher.prototype.searchMessages = function(term) {
      $('#messages tbody tr:not(:contains("' + term + '"))').hide();
      return $('#messages tbody tr(:contains("' + term + '"))').show();
    };

    MailCatcher.prototype.clearSearch = function() {
      return $('#messages tbody tr').show();
    };

    MailCatcher.prototype.addMessage = function(message) {
      return $('#messages tbody').append($('<tr />').attr('data-message-id', message.id.toString()).append($('<td/>').text(message.sender || "No sender").toggleClass("blank", !message.sender)).append($('<td/>').text((message.recipients || []).join(', ') || "No receipients").toggleClass("blank", !message.recipients.length)).append($('<td/>').text(message.subject || "No subject").toggleClass("blank", !message.subject)).append($('<td/>').text(this.formatDate(message.created_at))));
    };

    MailCatcher.prototype.loadMessage = function(id) {
      var _this = this;
      if ((id != null ? id.id : void 0) != null) id = id.id;
      id || (id = $('#messages tr.selected').attr('data-message-id'));
      if (id != null) {
        $('#messages tbody tr:not([data-message-id="' + id + '"])').removeClass('selected');
        $('#messages tbody tr[data-message-id="' + id + '"]').addClass('selected');
        return $.getJSON('/messages/' + id + '.json', function(message) {
          var $ul;
          $('#message .metadata dd.created_at').text(_this.formatDate(message.created_at));
          $('#message .metadata dd.from').text(message.sender);
          $('#message .metadata dd.to').text((message.recipients || []).join(', '));
          $('#message .metadata dd.subject').text(message.subject);
          $('#message .views .tab.format').each(function(i, el) {
            var $el, format;
            $el = $(el);
            format = $el.attr('data-message-format');
            if ($.inArray(format, message.formats) >= 0) {
              $el.find('a').attr('href', '/messages/' + id + '.' + format);
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
            $ul = $('<ul/>').appendTo($('#message .metadata dd.attachments').empty());
            $.each(message.attachments, function(i, attachment) {
              return $ul.append($('<li>').append($('<a>').attr('href', attachment['href']).addClass(attachment['type'].split('/', 1)[0]).addClass(attachment['type'].replace('/', '-')).text(attachment['filename'])));
            });
            $('#message .metadata .attachments').show();
          } else {
            $('#message .metadata .attachments').hide();
          }
          $('#message .views .download a').attr('href', "/messages/" + id + ".eml");
          if ($('#message .views .tab.analysis.selected').length) {
            return _this.loadMessageAnalysis();
          } else {
            return _this.loadMessageBody();
          }
        });
      }
    };

    MailCatcher.prototype.loadMessageBody = function(id, format) {
      id || (id = this.selectedMessage());
      format || (format = $('#message .views .tab.format.selected').attr('data-message-format'));
      format || (format = 'html');
      $("#message .views .tab[data-message-format=\"" + format + "\"]:not(.selected)").addClass('selected');
      $("#message .views .tab:not([data-message-format=\"" + format + "\"]).selected").removeClass('selected');
      if (id != null) {
        return $('#message iframe').attr("src", "/messages/" + id + "." + format);
      }
    };

    MailCatcher.prototype.loadMessageAnalysis = function(id) {
      var $form, $iframe;
      id || (id = this.selectedMessage());
      $("#message .views .analysis.tab:not(.selected)").addClass('selected');
      $("#message .views :not(.analysis).tab.selected").removeClass('selected');
      if (id != null) {
        $iframe = $('#message iframe').contents().children().html("<html>\n<head>\n<title>Analysis</title>\n" + ($('link[rel="stylesheet"]')[0].outerHTML) + "\n</head>\n<body class=\"iframe\">\n<h1>Analyse your email with Fractal</h1>\n<p><a href=\"http://getfractal.com/\" target=\"_blank\">Fractal</a> is a really neat service that applies common email design and development knowledge from <a href=\"http://www.email-standards.org/\" target=\"_blank\">Email Standards Project</a> to your HTML email and tells you what you've done wrong or what you should do instead.</p>\n<p>Please note that this <strong>sends your email to the Fractal service</strong> for analysis. Read their <a href=\"http://getfractal.com/terms\" target=\"_blank\">terms of service</a> if you're paranoid.</p>\n<form>\n<input type=\"submit\" value=\"Analyse\" /><span class=\"loading\" style=\"color: #999; display: none\">Analysing&hellip;</span>\n</form>\n</body>\n</html>");
        return $form = $iframe.find('form').submit(function(e) {
          e.preventDefault();
          $(this).find('input[type="submit"]').attr('disabled', 'disabled').end().find('.loading').show();
          return $('#message iframe').contents().find('body').xslt("/messages/" + id + "/analysis.xml", "/stylesheets/analysis.xsl");
        });
      }
    };

    MailCatcher.prototype.refresh = function() {
      var _this = this;
      return $.getJSON('/messages', function(messages) {
        return $.each(messages, function(i, message) {
          if (!_this.haveMessage(message)) return _this.addMessage(message);
        });
      });
    };

    MailCatcher.prototype.subscribe = function() {
      if (typeof WebSocket !== "undefined" && WebSocket !== null) {
        return this.subscribeWebSocket();
      } else {
        return this.subscribePoll();
      }
    };

    MailCatcher.prototype.subscribeWebSocket = function() {
      var secure,
        _this = this;
      secure = window.location.scheme === 'https';
      this.websocket = new WebSocket("" + (secure ? 'wss' : 'ws') + "://" + window.location.host + "/messages");
      return this.websocket.onmessage = function(event) {
        return _this.addMessage($.parseJSON(event.data));
      };
    };

    MailCatcher.prototype.subscribePoll = function() {
      var _this = this;
      if (this.refreshInterval == null) {
        return this.refreshInterval = setInterval((function() {
          return _this.refresh();
        }), 1000);
      }
    };

    return MailCatcher;

  })();

  $(function() {
    return window.MailCatcher = new MailCatcher;
  });

}).call(this);
