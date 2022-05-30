# 简介
这是一个测试 多个 / 单个 ipfs 节点的连接状态。

# 前置内容

## 数据库准备
通过 [table](./table.sql) 中的 sql 语句生成 表格

## 配置
通过 [config](./config/config.json) 配置需要测试的 IPFS 节点 & 数据库

# 使用

## docker
1. 通过 [docker_build](./docker_build.sh) 命令打包镜像

2. 通过 [ipfs-connect-test](./ipfs-connect-test.sh) 命令在目标服务器允许

> 通过 sh 传入的环境变量，值类型为字符串

获取镜像错误
```
Step 1/5 : FROM node:16.15.0-slim
16.15.0-slim: Pulling from library/node
error parsing HTTP 408 response body: invalid character '<' looking for beginning of value: "<html><body><h1>408 Request Time-out</h1>\nYour browser didn't send a complete request in time.\n</body></html>\n"
```
需要手动获取镜像

## npm
```npm
npm run start
```

## 输出
Logs 日志文件 & 数据库

# 时区 & 时间

## china-time
```nodejs
const chinaTime = require('china-time');

console.log(chinaTime()); // 2018-02-07T04:38:00.000Z
console.log(chinaTime().getTime()); // 1517978280000
console.log(chinaTime('YYYY-MM-DD HH:mm:ss')); // 2018-02-07 13:08:17
console.log(chinaTime('YY/MM/DD HH:mm')); // 18/02/07 13:08
console.log(chinaTime('YYYY MM DD')); // 2018 02 07
```

## moment
```nodejs
    const moment = require('moment');
    logger.info('moment.utc().format()', moment.utc().format())
    logger.info('moment.utcOffset(8).format()', moment(moment.utc().format()).utcOffset(8).format())
```

## dayjs
按官方文档测试，出错
https://github.com/guisturdy/dayjs-plugin-utc/tree/f37f2ca1a9546df7509722cf2ec1ac09f785b094
