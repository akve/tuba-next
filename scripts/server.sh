#!/bin/bash

cd /data
echo "Starting NPM for top level"
yarn
npx lerna link

cd /data/packages/api
echo "Starting NPM for server"
yarn

yarn swagger

yarn start

#./node_modules/.bin/pm2 start cron.js --cron "*/15 * * * *" --no-autorestart
#./node_modules/.bin/pm2 start cron_chat.js --cron "*/5 * * * *" --no-autorestart

