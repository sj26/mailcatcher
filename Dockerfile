# syntax=docker/dockerfile:1

FROM ruby:3.4-alpine
MAINTAINER Samuel Cochran <sj26@sj26.com>

# Use --build-arg VERSION=... to override
# or `rake docker VERSION=...`
ARG VERSION=0.10.0

# sqlite3 aarch64 is broken on alpine, so use ruby:
# https://github.com/sparklemotion/sqlite3-ruby/issues/372
RUN --mount=type=secret,id=mailcatcher-gem,target=/tmp/mailcatcher.gem \
    apk add --no-cache build-base libstdc++ sqlite-libs sqlite-dev && \
    ( [ "$(uname -m)" != "aarch64" ] || gem install sqlite3 --version="~> 1.3" --platform=ruby ) && \
    if [ -f /tmp/mailcatcher.gem ]; then \
      gem install /tmp/mailcatcher.gem; \
    else \
      gem install mailcatcher -v "$VERSION"; \
    fi && \
    apk del --rdepends --purge build-base sqlite-dev

EXPOSE 1025 1080

ENTRYPOINT ["mailcatcher", "--foreground"]
CMD ["--ip", "0.0.0.0"]
