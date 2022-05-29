readonly tag=12345605
readonly imageName=pan_ding_rong/ipfs-connect-test-master
docker build -t ${imageName}:${tag} .
docker tag ${imageName}:${tag} docker.isecsp.com/${imageName}:${tag}
docker push docker.isecsp.com/${imageName}:${tag}