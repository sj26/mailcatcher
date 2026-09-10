# syntax=docker/dockerfile:1

FROM ruby:4.0-alpine

# Use --build-arg VERSION=... to override
# or `rake docker VERSION=...`
ARG VERSION=0.11.0

RUN --mount=type=secret,id=mailcatcher-gem,target=/tmp/mailcatcher.gem \
    apk add --no-cache build-base libstdc++ sqlite-libs sqlite-dev && \
    if [ -f /tmp/mailcatcher.gem ]; then \
      gem install /tmp/mailcatcher.gem; \
    else \
      gem install mailcatcher -v "$VERSION"; \
    fi && \
    apk del --rdepends --purge build-base sqlite-dev

EXPOSE 1025 1080

ENTRYPOINT ["mailcatcher", "--foreground"]
CMD ["--ip", "0.0.0.0"]
