FROM ubuntu:trusty
MAINTAINER Paul Bowsher <paul.bowsher@gmail.com>

RUN apt-get update && apt-get install -y -q \
    build-essential \
    git \
    libssl-dev \
    libsqlite3-dev \
    nodejs \
    ruby-dev \
    sqlite3 \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/* \
 && gem install bundler --no-ri --no-rdoc

ADD . /app
WORKDIR /app

RUN bundle install
RUN bundle exec rake assets

EXPOSE 1025
EXPOSE 1080

ENTRYPOINT ["bundle", "exec", "mailcatcher", "-f"]
CMD ["--ip", "0.0.0.0"]
