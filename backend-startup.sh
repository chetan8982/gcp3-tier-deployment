#!/bin/bash
set -e

apt-get update
apt-get install -y nginx

cat > /var/www/html/index.html <<'HTML'
{
  "service": "backend",
  "status": "running",
  "message": "Frontend successfully connected to backend"
}
HTML

cat > /etc/nginx/sites-available/default <<'NGINX'
server {
    listen 8080 default_server;
    listen [::]:8080 default_server;

    root /var/www/html;

    location / {
        default_type application/json;
        add_header Access-Control-Allow-Origin "*" always;
        try_files $uri /index.html;
    }
}
NGINX

nginx -t
systemctl restart nginx
systemctl enable nginx
