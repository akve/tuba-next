#!/bin/bash

#cd /data/datatypes
#echo "Starting NPM for datatypes"
#yarn

cd /data/packages/crawler
echo "Starting NPM for crawler"
yarn

yarn start

#./node_modules/.bin/pm2 start cron.js --cron "*/15 * * * *" --no-autorestart
#./node_modules/.bin/pm2 start cron_chat.js --cron "*/5 * * * *" --no-autorestart

