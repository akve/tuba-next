#!/bin/bash

echo "Starting frontend - overall"
cd /data
npx lerna link

echo "Starting frontend"
cd /data/packages/next
yarn
echo "Generating build"
yarn build

echo "Starting server"
yarn start

