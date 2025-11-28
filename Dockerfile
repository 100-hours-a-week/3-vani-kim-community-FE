FROM node:18-alpine AS builder
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# CI환경용 설치 명령어, 배포에 필요한 모듈만 설치
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && \
    npm cache clean --force

# Runner Stage
FROM node:18-alpine
WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV=production

# node_modules만
COPY --from=builder /app/node_modules ./node_modules

COPY package*.json ./

# 소스 코드 복사
COPY public ./public
COPY server.js .

# 포트 노출
EXPOSE 3000

# 서버 실행
CMD ["node", "server.js"]