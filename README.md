# MailCatcher

Catches mail and serves it through a dream.

MailCatcher runs a super simple SMTP server which catches any message sent to it to display in a web interface. Run mailcatcher, set your favourite app to deliver to smtp://127.0.0.1:1025 instead of your default SMTP server, then check out http://127.0.0.1:1080 to see the mail that's arrived so far.

![MailCatcher screenshot](https://cloud.githubusercontent.com/assets/14028/14093249/4100f904-f598-11e5-936b-e6a396f18e39.png)

## Features

* Catches all mail and stores it for display.
* Shows HTML, Plain Text and Source version of messages, as applicable.
* Rewrites HTML enabling display of embedded, inline images/etc and opens links in a new window.
* Lists attachments and allows separate downloading of parts.
* Download original email to view in your native mail client(s).
* Command line options to override the default SMTP/HTTP IP and port settings.
* Mail appears instantly if your browser supports [WebSockets][websockets], otherwise updates every thirty seconds.
* Runs as a daemon in the background, optionally in foreground.
* Sendmail-analogue command, `catchmail`, makes using mailcatcher from PHP a lot easier.
* Keyboard navigation between messages

## How

1. `gem install mailcatcher`
2. `mailcatcher`
3. Go to http://127.0.0.1:1080/
4. Send mail through smtp://127.0.0.1:1025

Use `mailcatcher --help` to see the command line options. The brave can get the source from [the GitHub repository][mailcatcher-github].

### Bundler

Please don't put mailcatcher into your Gemfile. It will conflict with your applications gems at some point.

Instead, pop a note in your README stating you use mailcatcher, and to run `gem install mailcatcher` then `mailcatcher` to get started.

### RVM

Under RVM your mailcatcher command may only be available under the ruby you install mailcatcher into. To prevent this, and to prevent gem conflicts, install mailcatcher into a dedicated gemset with a wrapper script:

    rvm default@mailcatcher --create do gem install mailcatcher
    ln -s "$(rvm default@mailcatcher do rvm wrapper show mailcatcher)" "$rvm_bin_path/"

### Rails

To set up your rails app, I recommend adding this to your `environments/development.rb`:

    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = { :address => '127.0.0.1', :port => 1025 }
    config.action_mailer.raise_delivery_errors = false

### PHP

For projects using PHP, or PHP frameworks and application platforms like Drupal, you can set [PHP's mail configuration](http://www.php.net/manual/en/mail.configuration.php) in your [php.ini](http://www.php.net/manual/en/configuration.file.php) to send via MailCatcher with:

    sendmail_path = /usr/bin/env catchmail -f some@from.address

You can do this in your [Apache configuration](http://php.net/manual/en/configuration.changes.php) like so:

    php_admin_value sendmail_path "/usr/bin/env catchmail -f some@from.address"

If you've installed via RVM this probably won't work unless you've manually added your RVM bin paths to your system environment's PATH. In that case, run `which catchmail` and put that path into the `sendmail_path` directive above instead of `/usr/bin/env catchmail`.

If starting `mailcatcher` on alternative SMTP IP and/or port with parameters like `--smtp-ip 192.168.0.1 --smtp-port 10025`, add the same parameters to your `catchmail` command:

    sendmail_path = /usr/bin/env catchmail --smtp-ip 192.160.0.1 --smtp-port 10025 -f some@from.address

### Django

For use in Django, add the following configuration to your projects' settings.py

```python
if DEBUG:
    EMAIL_HOST = '127.0.0.1'
    EMAIL_HOST_USER = ''
    EMAIL_HOST_PASSWORD = ''
    EMAIL_PORT = 1025
    EMAIL_USE_TLS = False
```

### API

A fairly RESTful URL schema means you can download a list of messages in JSON from `/messages`, each message's metadata with `/messages/:id.json`, and then the pertinent parts with `/messages/:id.html` and `/messages/:id.plain` for the default HTML and plain text version, `/messages/:id/:cid` for individual attachments by CID, or the whole message with `/messages/:id.source`.

## Caveats

* Mail processing is fairly basic but easily modified. If something doesn't work for you, fork and fix it or [file an issue][mailcatcher-issues] and let me know. Include the whole message you're having problems with.
* Encodings are difficult. MailCatcher does not completely support utf-8 straight over the wire, you must use a mail library which encodes things properly based on SMTP server capabilities.

## TODO

* Add mail delivery on request, optionally multiple times.
* Compatibility testing against CampaignMonitor's [design guidelines](http://www.campaignmonitor.com/design-guidelines/) and [CSS support matrix](http://www.campaignmonitor.com/css/).
* Forward mail to rendering service, maybe CampaignMonitor?

## Thanks

MailCatcher is just a mishmash of other people's hard work. Thank you so much to the people who have built the wonderful guts on which this project relies.

## Donations

I work on MailCatcher mostly in my own spare time. If you've found Mailcatcher useful and would like to help feed me and fund continued development and new features, please [donate via PayPal][donate]. If you'd like a specific feature added to MailCatcher and are willing to pay for it, please [email me](mailto:sj26@sj26.com).

## License

Copyright © 2010-2018 Samuel Cochran (sj26@sj26.com). Released under the MIT License, see [LICENSE][license] for details.

  [donate]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=522WUPLRWUSKE
  [license]: https://github.com/sj26/mailcatcher/blob/master/LICENSE
  [mailcatcher-github]: https://github.com/sj26/mailcatcher
  [mailcatcher-issues]: https://github.com/sj26/mailcatcher/issues
  [websockets]: http://www.whatwg.org/specs/web-socket-protocol/
