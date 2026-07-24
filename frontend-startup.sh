#!/bin/bash
set -e

apt-get update
apt-get install -y nginx

cat > /var/www/html/index.html <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Form Project</title>
</head>
<body>
  <h1>Frontend VM is running</h1>
  <button onclick="callBackend()">Call Backend</button>
  <pre id="result">Click the button to test the connection.</pre>

  <script>
    async function callBackend() {
      const result = document.getElementById("result");

      try {
        const response = await fetch("/api/");
        const data = await response.json();
        result.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        result.textContent = "Backend request failed: " + error.message;
      }
    }
  </script>
</body>
</html>
HTML

cat > /etc/nginx/sites-available/default <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://10.10.0.2:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

nginx -t
systemctl restart nginx
systemctl enable nginx
