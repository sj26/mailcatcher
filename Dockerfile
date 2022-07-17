### BUILD
FROM ruby:3.0-alpine as build

RUN apk update --no-cache --force \
    && apk add --no-cache \
        build-base \
        sqlite-libs \
        sqlite-dev

WORKDIR /app
COPY . .
RUN gem build mailcatcher.gemspec --output=mailcatcher.gem

## FINAL
FROM ruby:3.0-alpine as final
LABEL maintainer="Samuel Cochran <sj26@sj26.com>"

WORKDIR /app
COPY --from=build /app/mailcatcher.gem /app/mailcatcher.gem
RUN apk update --no-cache --force \
    && apk add sqlite-libs \
    && apk add --no-cache --virtual build \
        build-base \
        sqlite-dev \
    && gem install /app/mailcatcher.gem \
    && apk del build

EXPOSE 1025 1080

ENTRYPOINT ["mailcatcher", "--foreground"]
CMD ["--ip", "0.0.0.0"]
