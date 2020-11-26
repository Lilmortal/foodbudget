#!/bin/bash
yum install -y docker
service docker start
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com
sudo usermod -aG docker ec2-user
docker pull 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget-api:latest
docker run -p 8080:8080 -d 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget-api:latest

docker pull 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget-jobs:latest
docker run -d 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget-jobs:latest