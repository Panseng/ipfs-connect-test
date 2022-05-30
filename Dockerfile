FROM node:16.15.0-buster-slim
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm config set unsafe-perm true \
    && npm i --production 

CMD ["npm", "start"]