(function() {
  var MailCatcher;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jQuery.expr[':'].icontains = function(a, i, m) {
    var _ref, _ref2;
    return ((_ref = (_ref2 = a.textContent) != null ? _ref2 : a.innerText) != null ? _ref : "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };
  MailCatcher = (function() {
    function MailCatcher() {
      this.nextTab = __bind(this.nextTab, this);;
      this.previousTab = __bind(this.previousTab, this);;
      this.openTab = __bind(this.openTab, this);;
      this.selectedTab = __bind(this.selectedTab, this);;
      this.getTab = __bind(this.getTab, this);;      $('#messages tr').live('click', __bind(function(e) {
        e.preventDefault();
        return this.loadMessage($(e.currentTarget).attr('data-message-id'));
      }, this));
      $('input[name=search]').keyup(__bind(function(e) {
        var query;
        query = $.trim($(e.currentTarget).val());
        if (query) {
          return this.searchMessages(query);
        } else {
          return this.clearSearch();
        }
      }, this));
      $('#message .views .format.tab a').live('click', __bind(function(e) {
        e.preventDefault();
        return this.loadMessageBody(this.selectedMessage(), $($(e.currentTarget).parent('li')).data('message-format'));
      }, this));
      $('#message .views .analysis.tab a').live('click', __bind(function(e) {
        e.preventDefault();
        return this.loadMessageAnalysis(this.selectedMessage());
      }, this));
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
      $('nav.app .clear a').live('click', __bind(function(e) {
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
      }, this));
      $('nav.app .quit a').live('click', __bind(function(e) {
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
      }, this));
      key('up', __bind(function() {
        var id;
        id = this.selectedMessage() || 1;
        if (id > 1) {
          id -= 1;
        }
        return this.loadMessage(id);
      }, this));
      key('down', __bind(function() {
        var id;
        id = this.selectedMessage() || this.messagesCount();
        if (id < this.messagesCount()) {
          id += 1;
        }
        return this.loadMessage(id);
      }, this));
      key('⌘+up, ctrl+up', __bind(function() {
        return this.loadMessage(1);
      }, this));
      key('⌘+down, ctrl+down', __bind(function() {
        return this.loadMessage(this.messagesCount());
      }, this));
      key('left', __bind(function() {
        return this.openTab(this.previousTab());
      }, this));
      key('right', __bind(function() {
        return this.openTab(this.nextTab());
      }, this));
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
      if (typeof date === "string") {
        date && (date = this.parseDate(date));
      }
      date && (date = this.offsetTimeZone(date));
      return date && (date = date.toString("dddd, d MMM yyyy h:mm:ss tt"));
    };
    MailCatcher.prototype.messagesCount = function() {
      return $('#messages tr').length - 1;
    };
    MailCatcher.prototype.tabs = function() {
      return $('#message ul').children('.tab');
    };
    MailCatcher.prototype.getTab = function(i) {
      return $(this.tabs()[i]);
    };
    MailCatcher.prototype.selectedTab = function() {
      return this.tabs().index($('#message li.tab.selected'));
    };
    MailCatcher.prototype.openTab = function(i) {
      return this.getTab(i).children('a').click();
    };
    MailCatcher.prototype.previousTab = function(tab) {
      var i;
      i = tab || tab === 0 ? tab : this.selectedTab() - 1;
      if (i < 0) {
        i = this.tabs().length - 1;
      }
      if (this.getTab(i).is(":visible")) {
        return i;
      } else {
        return this.previousTab(i - 1);
      }
    };
    MailCatcher.prototype.nextTab = function(tab) {
      var i;
      i = tab ? tab : this.selectedTab() + 1;
      if (i > this.tabs().length - 1) {
        i = 0;
      }
      if (this.getTab(i).is(":visible")) {
        return i;
      } else {
        return this.nextTab(i + 1);
      }
    };
    MailCatcher.prototype.haveMessage = function(message) {
      if (message.id != null) {
        message = message.id;
      }
      return $("#messages tbody tr[data-message-id=\"" + message + "\"]").length > 0;
    };
    MailCatcher.prototype.selectedMessage = function() {
      return $('#messages tr.selected').data('message-id');
    };
    MailCatcher.prototype.searchMessages = function(query) {
      var $rows, selector, token;
      selector = ((function() {
        var _i, _len, _ref, _results;
        _ref = query.split(/\s+/);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          token = _ref[_i];
          _results.push(":icontains('" + token + "')");
        }
        return _results;
      })()).join("");
      $rows = $("#messages tbody tr");
      $rows.not(selector).hide();
      return $rows.filter(selector).show();
    };
    MailCatcher.prototype.clearSearch = function() {
      return $('#messages tbody tr').show();
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
          var $ul;
          $('#message .metadata dd.created_at').text(this.formatDate(message.created_at));
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
            return this.loadMessageAnalysis();
          } else {
            return this.loadMessageBody();
          }
        }, this));
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
      return $.getJSON('/messages', __bind(function(messages) {
        return $.each(messages, __bind(function(i, message) {
          if (!this.haveMessage(message)) {
            return this.addMessage(message);
          }
        }, this));
      }, this));
    };
    MailCatcher.prototype.subscribe = function() {
      if (typeof WebSocket != "undefined" && WebSocket !== null) {
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
