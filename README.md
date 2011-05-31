# MailCatcher

Catches mail and serves it through a dream.

MailCatcher runs a super simple SMTP server which catches any message sent to it to display in a web interface. Run mailcatcher, set your favourite app to deliver to smtp://127.0.0.1:1025 instead of your default SMTP server, then check out http://127.0.0.1:1080 to see the mail that's arrived so far.

![MailCatcher screenshot](http://puu.sh/2fZR)

## Features

* Catches all mail and stores it for display.
* Shows HTML, Plain Text and Source version of messages, as applicable.
* Rewrites HTML enabling display of embedded, inline images/etc and open links in a new window. (currently very basic)
* Lists attachments and allows separate downloading of parts.
* Download original email to view in your native mail client(s).
* Command line options to override the default SMTP/HTTP IP and port settings.
* Mail appears instantly if your browser supports [WebSockets][websockets].
* Runs as a daemon run in the background.
* Sendmail-analogue command, `catchmail`, makes [using mailcatcher from PHP][withphp] a lot easier.
* Written super-simply in EventMachine, easy to dig in and change.

## How

1. `gem install mailcatcher`
2. `mailcatcher`
3. Go to http://localhost:1080/
4. Send mail through smtp://localhost:1025

The brave can get the source from [the GitHub repository][mailcatcher-github].

## RVM

Under RVM your mailcatcher command may only available under the ruby you install mailcatcher into. To prevent this, and to prevent gem conflicts, install mailcatcher into a dedicated gemset and create wrapper scripts:

    rvm default@mailcatcher --create gem install mailcatcher
    rvm wrapper default@mailcatcher --no-prefix mailcatcher catchmail

## API

A fairly RESTful URL schema means you can download a list of messages in JSON from `/messages`, each message's metadata with `/messages/:id.json`, and then the pertinent parts with `/messages/:id.html` and `/messages/:id.plain` for the default HTML and plain text version, `/messages/:id/:cid` for individual attachments by CID, or the whole message with `/messages/:id.source`.

## Caveats

* Mail processing is fairly basic but easily modified. If something doesn't work for you, fork and fix it or file an issue and let me know. Include the whole message you're having problems with.
* The interface is very basic and has not been tested on many browsers yet.

## TODO

* Growl support.
* Test suite.
* Add mail delivery on request, optionally multiple times.
* Forward mail to rendering service, maybe CampaignMonitor?
* Package as an app? Native interfaces? HotCocoa?

## Thanks

MailCatcher is just a mishmash of other people's hard work. Thank you so much to the people who have built the wonderful guts on which this project relies.

Thanks also to [The Frontier Group][tfg] for giving me the idea, being great guinea pigs and letting me steal pieces of time to keep the project alive.

## Copyright

Copyright © 2010-2011 Samuel Cochran. See [LICENSE][license] for details.

## Dreams

For dream catching, try [this](http://goo.gl/kgbh). OR [THIS](http://www.nyanicorn.com), OMG.

  [license]: https://github.com/sj26/mailcatcher/blob/master/LICENSE
  [mailcatcher-github]: https://github.com/sj26/mailcatcher
  [tfg]: http://www.thefrontiergroup.com.au
  [websockets]: http://www.whatwg.org/specs/web-socket-protocol/
  [withphp]: http://webschuur.com/publications/blogs/2011-05-29-catchmail_for_drupal_and_other_phpapplications_the_simple_version