FROM ruby:2.3
MAINTAINER Samuel Cochran <sj26@sj26.com>

RUN gem install mailcatcher

EXPOSE 1025
EXPOSE 1080

ENTRYPOINT ["mailcatcher", "-f"]
CMD ["--ip", "0.0.0.0"]
