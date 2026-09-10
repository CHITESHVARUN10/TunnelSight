FROM alpine:latest

# Install strongSwan for IPsec and tcpdump for packet capture
RUN apk update && \
    apk add --no-cache strongswan tcpdump iproute2 iputils bash

# Keep the container running so we can exec into it
CMD ["tail", "-f", "/dev/null"]
