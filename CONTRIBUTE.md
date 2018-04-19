# How to contribute

## Using docker + docker-compose

Run `docker-compose up`, it will install all requirements and start mailcatcher that will be available on port 8080 for the web interface and 8025 for smtp.

Run `docker-compose run --rm web ruby2.4 scripts/test` to execute the test suite.
