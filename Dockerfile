FROM ruby:3.2.2-slim-bullseye

ARG ENVIRONMENT=production
ARG MAILCATCHER_AUTH_USER=
ARG MAILCATCHER_AUTH_PASSWORD=

ENV MAILCATCHER_ENV=$ENVIRONMENT
ENV RACK_ENV=$ENVIRONMENT
ENV MAILCATCHER_AUTH_USER=$MAILCATCHER_AUTH_USER
ENV MAILCATCHER_AUTH_PASSWORD=$MAILCATCHER_AUTH_PASSWORD

ENV GEM_HOME=/usr/local/lib/ruby/gems/3.2.0
ENV PATH=$PATH:/usr/local/bundle/bin

RUN apt-get update -qq
RUN apt-get install -qq -y --no-install-recommends \
    build-essential libpq-dev curl apt-transport-https imagemagick \
    libsqlite3-dev git shared-mime-info libffi-dev deborphan libreadline-dev
RUN apt-get update -qq && apt-get full-upgrade -qq -y && apt-get autoclean -qq -y

WORKDIR /app

COPY Gemfile Gemfile.lock .ruby-version .version LICENSE README.md ./
RUN gem update --system

RUN if [ "$ENVIRONMENT" != "development" ]; then \
        bundle config set --local without 'development test lint'; \
    fi

RUN bundle check || bundle install --full-index --no-binstubs --jobs 6 --retry 3

COPY ./bin ./bin
COPY ./lib ./lib
COPY ./public ./public
COPY ./vendor ./vendor
COPY ./views ./views

RUN apt remove --purge deborphan -qq -y && apt autoremove -qq -y && apt autoclean -qq -y

EXPOSE 1025 1080

CMD ["bin/mailcatcher", "--foreground", "--no-quit", "--ip", "0.0.0.0"]
