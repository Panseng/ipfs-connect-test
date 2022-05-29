const { create } = require('ipfs-http-client')
const log4js = require('log4js');
const { Client } = require('pg');
const fs = require('fs');

const chinaTime = require('china-time');

// log4js的输出级别6个: trace, debug, info, warn, error, fatal
log4js.configure({
    //输出位置的基本信息设置
    appenders: {
        //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
        out: { type: 'console' },
        //所有日志记录，文件类型file   文件最大值maxLogSize 单位byte (B->KB->M) backups:备份的文件个数最大值,最新数据覆盖旧数据
        allfileLog: { 
            type: 'file',
            filename: './logs/logs.log',
            maxLogSize: 1024*1024*10,
            backups: 30,
            // 日志文件按日期（天）切割
            pattern: "yyyy-MM-dd",
            // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
            keepFileExt: true,
            // 输出的日志文件名是都始终包含 pattern 日期结尾
            alwaysIncludePattern: true
        },
    },
    //不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog']  categories 作为getLogger方法的键名对应
    categories: {
        default: { appenders: ['out', 'allfileLog'], level: 'debug' }, //error写入时是经过筛选后留下的
    }
});
// 使用示例
//如果 log4js.getLogger 中没有指定，默认为default日志的配置项
const logger = log4js.getLogger();

// @潘丁榕  5个ipfs节点
// 1、本地：192.168.1.30 api端口：5001 网关：8082
//                 其中的网关8082通过rpc提供对外的80端口访问：nft-store.frp.isecsp.com
// 2、期刊网：220.243.137.16 api端口：5001 网关：8082
// 3、三丰云：111.67.196.49 api端口：5001 网关：8082
// 4、三丰云：111.67.199.90 api端口：5001 网关：8082
// 5、小鸟云：103.45.110.138 api端口：5008 网关：8080（只可127.0.0.1访问）
let path = './config/config.json'
if (process.env.CONFIG_JSON_PATH) path = process.env.CONFIG_JSON_PATH;
let IPFS_NODES = [
    {host: '192.168.1.147', port: 5001},
    {host: 'nft-store.frp.isecsp.com', port: 80},
    {host: '192.168.1.30', port: 5001},
    {host: '220.243.137.16', port: 5001},
    {host: '111.67.196.49', port: 5001},
    {host: '111.67.199.90', port: 5001},
    {host: '103.45.110.138', port: 5008},
];
let pg_cfg = {
    user: 'ada',
    host: '192.168.1.143',
    database: 'ada',
    password: 'pass_2022',
    port: 5432,
  }
try{
    let data = fs.readFileSync(path, 'utf-8');
    data = JSON.parse(data)
    IPFS_NODES = data.IPFS;
    pg_cfg = data.PG;
    logger.info('读取配置: ', data)
} catch(e){
    logger.error('读取配置信息出错: ', e)
}

const PQ_CLIENT = new Client(pg_cfg);
PQ_CLIENT.connect()


// 记录 id 基础
const ID_BASE = chinaTime('YYYYMMDDHHmmss')
let id_num = 0;

function main (){
    // checkIPFS(IPFS_NODES[2].host, IPFS_NODES[2].port, getLocalTime(8))
    traverse();
    interval()
    // timeZoneTest()
}

main()

function interval(){
    setInterval(traverse, 10 * 60 * 1000)
}

function traverse(){
    for (let ipfs of IPFS_NODES){
        checkIPFS(ipfs.host, ipfs.port, chinaTime('YYYY-MM-DD HH:mm:ss'))
    }
}

async function checkIPFS (host, port, time) {
    const ipfs = create({
        host: host,
        port: port,
        protocol: 'http',
        timeout: 10 * 1000
      });
    let id = '';
    let sql = '';
    try{
        const res = await ipfs.add('Hello world!')
        id_num++;
        id = ID_BASE + '-' + id_num + '-' + randNum()
        sql = `insert into ipfs_status (id, host_url, connect_time, msg_type, msg) values ('${id}', '${host}', '${time}', 'success', '')`;
        logger.info('IPFS 连接正常：', 'id: ' + id, ', host: ' + host, ', time: ' +time + ', res: ', res, ', sql: ' + sql)
        PQ_CLIENT.query(sql)
    } catch(error) {
        id_num++;
        id = ID_BASE + '-' + id_num + '-' + randNum()
        sql = `insert into ipfs_status (id, host_url, connect_time, msg_type, msg) values ('${id}', '${host}', '${time}', 'error', '${error}')`;
        logger.error('IPFS 连接异常：', 'id: ' + id, ', host: ' + host, ', time: ' +time, ', sql: ' + sql + ', error: ', error)
        PQ_CLIENT.query(sql)
        // PQ_CLIENT.query(`insert into ipfs_status (id, host_url, connect_time, msg_type, msg) values (${id}, ${host}, ${time}, 'error', ${error})`)
    }
}

function randNum(){
    return Math.floor(Math.random() * 1000000)
}

// 获取东八区时间
// 时区
function getLocalTime (i) {
    let d = new Date()
    let len = d.getTime()
    let offset = d.getTimezoneOffset() * 60000
    let utcTime = len + offset
    return new Date(utcTime + 3600000 * i)
}

function timeZoneTest() {
    const moment = require('moment');
    logger.info('moment.utc().format()', moment.utc().format())
    logger.info('moment.utcOffset(8).format()', moment(moment.utc().format()).utcOffset(8).format())
    // const dayjs = require('dayjs');
    // const dayjsPluginUTC = require('dayjs-plugin-utc');
    // dayjs.extend(dayjsPluginUTC)
    // let time = dayjs(new Date().toLocaleString())
    // logger.info('day.utc().format() ', day.utc().format())
    // logger.info('day.local().format() ', day.local().format())
    // // 60 * 8 = 480
    // logger.info('day.utcOffset(240).format() ', day.utcOffset(480).format())
}