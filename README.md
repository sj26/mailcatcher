# MailCatcher

Catches mail and serves it through a dream.

MailCatcher runs a super simple SMTP server which catches any message sent to it to display in a web interface. Run mailcatcher, set your favourite app to deliver to smtp://127.0.0.1:1025 instead of your default SMTP server, then check out http://127.0.0.1:1080 to see the mail that's arrived so far.

## How

1. `gem install mailcatcher`
2. `mailcatcher`
3. Go to http://localhost:1080/
4. Send mail through smtp://localhost:1025

## Features

* Catches all mail and stores it for display.
* Shows HTML, Plain Text and Source version of messages, as applicable.
* Rewrites HTML enabling display of embedded, inline images/etc. (currently very basic)
* Lists attachments and allows separate downloading of parts.
* Written super-simply in EventMachine, easy to dig in and change.
* Command line options to override the default SMTP/HTTP IP and port settings.
* Mail appears instantly if your browser supports [WebSockets][websockets].

## Caveats

* Mail requires activesupport which requires i18n, but it doesn't list it as a dependency. For now I've added i18n as a requirement for MailCatcher.
* Mail proccessing is fairly basic but easily modified. If something doesn't work for you, fork and fix it or file an issue and let me know. Include the whole message you're having problems with.
* The interface is very basic and has not been tested on many browsers yet.

## TODO

* Download link to view original message in mail client.
* Growl support.
* Test suite.
* Add mail delivery on request, optionally multiple times.
* Forward mail to rendering service, maybe CampaignMonitor?
* Package as an app? Native interfaces? HotCocoa?

## Thanks

MailCatcher is just a mishmash of other people's hard work. Thank you so much to the people who have built the wonderful guts on which this project relies.

## Copyright

Copyright (c) 2010 Samuel Cochran. See LICENSE for details.

## Dreams

For dream catching, try [this](http://goo.gl/kgbh).

  [websockets]: http://www.whatwg.org/specs/web-socket-protocol/