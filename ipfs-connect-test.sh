readonly tag=test

docker pull docker.isecsp.com/ipfs/ipfs-connect-test:${tag}
docker stop ipfs-connect-test
docker rm ipfs-connect-test

docker run --restart=always \
  -v /data/ada/logs/ipfs-connect-test:/usr/src/app/logs \
  -v /data/docker/ipfs-connect-test/config:/usr/src/app/config \
  -e CONFIG_JSON_PATH="./config/config.json" \
  -d --name=ipfs-connect-test \
docker.isecsp.com/ipfs/ipfs-connect-test:${tag}