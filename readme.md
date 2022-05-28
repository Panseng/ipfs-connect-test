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

## npm
```npm
npm run start
```

## 输出
Logs 日志文件 & 数据库