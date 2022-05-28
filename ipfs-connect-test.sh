readonly tag=12345601

docker pull docker.isecsp.com/pan_ding_rong/ipfs-connect-test-master:${tag}
docker stop ipfs-connect-test
docker rm ipfs-connect-test

docker run --restart=always \
  -v /data/ada/logs/ipfs-connect-test:/usr/src/app/logs \
  -v /data/docker/ipfs-connect-test/config:/usr/src/app/config \
  -e CONFIG_JSON_PATH="./config/config.json" \
  -d --name=ipfs-connect-test \
docker.isecsp.com/pan_ding_rong/ipfs-connect-test-master:${tag}