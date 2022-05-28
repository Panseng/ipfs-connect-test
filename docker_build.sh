readonly tag=test
readonly imageName=ipfs/ipfs-connect-test
docker build -t ${imageName}:${tag} .
docker tag ${imageName}:${tag} docker.isecsp.com/${imageName}:${tag}
docker push docker.isecsp.com/${imageName}:${tag}