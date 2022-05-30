readonly tag=12345601

docker pull docker.isecsp.com/pan_ding_rong/ipfs-connect-test-master:${tag}
docker stop ipfs-connect-test
docker rm ipfs-connect-test

docker run --restart=always \
  -d --name=ipfs-connect-test \
  -v /data/ada/logs/ipfs-connect-test:/usr/src/app/logs \
  -v /data/docker/ipfs-connect-test/config:/usr/src/app/config \
  -e CONFIG_JSON_PATH="./config/config.json" \
  -e CYCLE_TIME=180000 \
docker.isecsp.com/pan_ding_rong/ipfs-connect-test-master:${tag}