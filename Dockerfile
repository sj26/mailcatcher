FROM ruby:2.5
MAINTAINER Samuel Cochran <sj26@sj26.com>

ARG VERSION=0.6.5

RUN gem install mailcatcher -v $VERSION

EXPOSE 1025 1080

ENTRYPOINT ["mailcatcher", "--foreground"]
CMD ["--ip", "0.0.0.0"]
