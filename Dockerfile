FROM ruby:2.3
MAINTAINER Samuel Cochran <sj26@sj26.com>

RUN gem install mailcatcher

EXPOSE 1025 1080

CMD ["mailcatcher", "-f", "--ip=0.0.0.0"]
