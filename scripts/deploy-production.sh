#!/bin/bash

ssh -i id_23e191f6bb27b41674686cff58477abf weatherbar@192.241.158.183 << EOF

echo -e "\n\033[38;5;34m✓ Weather Bar API › Starting Production Deployment\033[0m\n"

cd /weatherbar/www/api.weatherbar.com/html

echo -e "\n\033[38;5;34m✓ Weather Bar API › Stopping Production API\033[0m\n"

npm stop

echo -e "\n\033[38;5;34m✓ Weather Bar API › Updating Production Repository\033[0m\n"

git checkout --force master
git stash
git pull

echo -e "\n\033[38;5;34m✓ Weather Bar API › Update Production NPM Package\033[0m\n"

npm install --no-optional

echo -e "\n\033[38;5;34m✓ Weather Bar API › Migrate Production Database\033[0m\n"

npm run migrate

echo -e "\n\033[38;5;34m✓ Weather Bar API › Seed Production Database\033[0m\n"

npm run seed

echo -e "\n\033[38;5;34m✓ Weather Bar API › Update Production Elasticsearch\033[0m\n"

npm run elasticsearch:delete
npm run elasticsearch:create
npm run elasticsearch:update

echo -e "\n\033[38;5;34m✓ Weather Bar API › Generate Production Documentation\033[0m\n"

npm run docs:clean
npm run docs

echo -e "\n\033[38;5;34m✓ Weather Bar API › Starting Production API\033[0m\n"

npm start

echo -e "\n\033[38;5;34m✓ Weather Bar API › Production Deployment Complete\033[0m\n"

EOF
