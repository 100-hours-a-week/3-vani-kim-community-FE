#!/bin/bash

# 에러 발생 시 즉시 중단
set -e

# 로그 파일 설정 (로그 파일 위치도 권한 문제 없게 홈 디렉토리로)
LOG_FILE="/home/ubuntu/deploy.log"
exec > >(tee -a $LOG_FILE) 2>&1

# ===========================
# 1. 환경 설정
# ===========================
PROJECT_NAME="vani/express"
CONTAINER_NAME="community-express-app"
IMAGE_TAG="latest"

AWS_REGION="ap-northeast-2"
AWS_ACCOUNT_ID="658173955655"

PORT_MAPPING="3000:3000"

# ECR URI 조립
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_URI}/${PROJECT_NAME}:${IMAGE_TAG}"

# appspec.yml의 destination과 일치해야 함
PROJECT_ROOT="/home/ubuntu/app-deployment"

NGINX_CONF_SRC="$PROJECT_ROOT/nginx/default.conf"
NGINX_CONF_DEST="/etc/nginx/sites-available/default"

echo "=========================================="
echo "Deployment started at $(date)"
echo "=========================================="

# ===========================
# 2. Docker 배포
# ===========================

# ECR 로그인
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

echo "Pulling Docker image: $IMAGE_URI"
docker pull $IMAGE_URI

# 기존 컨테이너 중지 및 삭제
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  echo "Stopping existing container..."
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi

echo "Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -p $PORT_MAPPING \
  -e TZ=Asia/Seoul \
  $IMAGE_URI

# 사용하지 않는 이미지 정리 (공간 확보)
echo "Cleaning up old Docker images..."
docker image prune -af --filter "until=48h"

echo "Current disk usage:"
docker system df

# ===========================
# 3. Nginx 설정 업데이트
# ===========================
echo "Nginx configuration update..."

if [ -f "$NGINX_CONF_SRC" ]; then
  sudo cp "$NGINX_CONF_SRC" "$NGINX_CONF_DEST"
  echo "File copy complete: $NGINX_CONF_SRC -> $NGINX_CONF_DEST"
else
  echo "❌ Error: Nginx file missing at $NGINX_CONF_SRC"
  exit 1
fi

# 문법 검사
echo "Testing Nginx configuration..."
sudo nginx -t

# 재시작
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "=========================================="
echo "Deployment completed successfully at $(date)"
echo "=========================================="