FROM node:12.4

WORKDIR /data/frontend-next

COPY frontend-next/ /data/frontend-next

RUN yarn && yarn build

CMD [ "yarn", "start" ]
