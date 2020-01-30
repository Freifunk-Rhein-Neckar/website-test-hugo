# Webseite des Freifunk Rhein Neckars

Dieses Repository enthält die Webseite welche unter https://www.freifunk-rhein-neckar.de/ zur Verfügung steht.


## Webserver Konfiguration
Die folgende Konfiguration wäre beispielsweise eine mögliche Konfiguration für nginx:

```
server {
    listen 80;
    listen [::]:80;
    server_name www.freifunk-rhein-neckar.de;
    server_name freifunk-rhein-neckar.de;
    server_name www.ffrn.de
    server_name ffrn.de;

    root /var/www/website/;
    index index.html;

    location ^~ /.well-known/acme-challenge {
        alias /var/www/dehydrated;
    }

    location / {
        return 301 https://$host$request_uri;
    }

    location ~ /\.git {
        deny all;
    }
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.freifunk-rhein-neckar.de;

    root /var/www/website/;
    index index.php index.html;

    location = /meshviewer.json {
        proxy_pass https://map.ffrn.de/data/meshviewer.json;
        proxy_cache off;
    }

    location ^~ /.well-known/acme-challenge {
        alias /var/www/dehydrated;
    }

    location ~ /\.git {
        deny all;
    }

    ssl_certificate /etc/dehydrated/certs/ffrn.de/fullchain.pem;
    ssl_certificate_key /etc/dehydrated/certs/ffrn.de/privkey.pem;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name freifunk-rhein-neckar.de;
    server_name www.ffrn.de
    server_name ffrn.de;

    location ^~ /.well-known/acme-challenge {
        alias /var/www/dehydrated;
    }

    location / {
        return 302 https://www.freifunk-rhein-neckar.de$request_uri;
    }

    location ~ /\.git {
        deny all;
    }

    ssl_certificate /etc/dehydrated/certs/ffrn.de/fullchain.pem;
    ssl_certificate_key /etc/dehydrated/certs/ffrn.de/privkey.pem;
}
```