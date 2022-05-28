FROM node:16.15-buster
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN sed -i s@archive.ubuntu.com@mirrors.aliyun.com@g /etc/apt/sources.list \
    && sed -i s@deb.debian.org@mirrors.aliyun.com@g /etc/apt/sources.list \
    && sed -i s@security.debian.org@mirrors.aliyun.com@g /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y dieharder\
    && apt-get install -y tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && npm config set unsafe-perm true \
    && npm install --quiet node-gyp -g \
    && npm i --production 

CMD ["npm", "start"]