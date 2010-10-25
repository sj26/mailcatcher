# MailCatcher

Catches mail and serves it through a dream.

MailCatcher runs a super simple SMTP server which catches any message sent to it to display in a web interface. Run mailcatcher, set your favourite app to deliver to smtp://127.0.0.1:1025 instead of your default SMTP server, then check out http://127.0.0.1:1080 to see the mail that's arrived so far.

## Features

* Catches all mail and stores it for display.
* Shows HTML, Plain Text and Source version of messages, as applicable.
* Rewrites HTML enabling display of embedded, inline images/etc. (currently very basic)
* Lists attachments and allows separate downloading of parts.
* Written super-simply in EventMachine, easy to dig in and change.
* Command line options to override the default smtp/http ip and port settings

## Caveats

* Mail requires activesupport which requires i18n, but it doesn't list it as a dependency. For now I've added i18n as a requirement for MailCatcher.
* For now you need to refresh the page to see new mail. Websockets support is coming soon to show new mail immediately.
* Mail proccessing is fairly basic but easily modified. If something doesn't work for you, fork and fix it or file an issue and let me know. Include the whole message you're having problems with.
* The interface is very basic and has not been tested on many browsers yet.

## TODO

* Websockets for immediate mail viewing.
* Download link to view original message in mail client.
* Growl support.
* Test suite.
* Better organisation.
* Better interface. SproutCore?
* Add mail delivery on request, optionally multiple times.
* Forward mail to rendering service, maybe CampaignMonitor?
* Package as an app? Native interfaces?

## License

MailCatcher is released under the MIT License. See LICENSE.

## Dreams

For dream catching, try [this](http://goo.gl/kgbh).