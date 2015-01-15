FROM ubuntu:trusty
MAINTAINER Paul Bowsher <paul.bowsher@gmail.com>

RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev git build-essential && \
    apt-get install -y ruby-dev libssl-dev && \
    apt-get install -y nodejs && \
    apt-get clean && \
    gem install bundler --no-ri --no-rdoc

ADD . /app
WORKDIR /app

RUN bundle install
RUN bundle exec rake assets

EXPOSE 1025
EXPOSE 1080

ENTRYPOINT ["bundle", "exec", "mailcatcher", "--ip", "0.0.0.0", "-f"]
