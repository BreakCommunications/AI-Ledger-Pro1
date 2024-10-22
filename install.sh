#!/bin/bash

# AI Ledger Pro Installation Script

# Check if script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# Update system
apt update && apt upgrade -y

# Install necessary packages
apt install -y nodejs npm mysql-server nginx

# Install PM2 globally
npm install -g pm2

# Clone the repository
git clone https://github.com/your-repo/ai-ledger-pro.git
cd ai-ledger-pro

# Install dependencies
npm install

# Prompt for database details
read -p "Enter MySQL database name: " DB_NAME
read -p "Enter MySQL username: " DB_USER
read -s -p "Enter MySQL password: " DB_PASS
echo

# Create MySQL database and user
mysql -e "CREATE DATABASE ${DB_NAME};"
mysql -e "CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Set up environment variables
cat > .env << EOL
PORT=3000
DB_HOST=localhost
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
JWT_SECRET=$(openssl rand -hex 64)
FRONTEND_URL=http://localhost
NODE_ENV=production
EOL

# Build the application
npm run build

# Set up Nginx
cat > /etc/nginx/sites-available/ai-ledger-pro << EOL
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

ln -s /etc/nginx/sites-available/ai-ledger-pro /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Start the application with PM2
pm2 start npm --name "ai-ledger-pro" -- start
pm2 save

# Create admin account
node scripts/createAdminAccount.js

echo "AI Ledger Pro has been installed successfully!"
echo "You can now access the application at http://your-server-ip"
echo "Admin credentials:"
echo "Email: admin@ailedgerpro.com"
echo "Password: AdminSecurePass123!"
echo "Please change the admin password after first login."