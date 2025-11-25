FROM ubuntu:22.04
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y bind9 bind9utils bind9-doc dnsutils
COPY named.conf.options /etc/bind/named.conf.options
COPY db.projetoeng.com.br /etc/bind/db.projetoeng.com.br
RUN chown -R bind:bind /etc/bind
EXPOSE 53/udp 53/tcp
CMD ["named", "-g", "-c", "/etc/bind/named.conf"]