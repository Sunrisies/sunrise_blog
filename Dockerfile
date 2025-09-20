# 多阶段构建示例
FROM nest_node:latest AS builder
WORKDIR /home/temp
COPY dist1 /home/temp/dist
COPY src/config /home/temp/src/config
COPY .env.production.local /home/temp/.env.production.local
RUN pkg /home/temp/dist/index.js --target=node22 --platform=alpine --output=web_server

FROM alpine:latest AS production
WORKDIR /home/app
RUN apk update && apk add tzdata
ENV TZ=Asia/Shanghai
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata
# 从builder阶段复制编译结果
COPY --from=builder /home/temp/web_server /home/app
# 复制配置文件（保持原有结构）
COPY --from=builder /home/temp/src/config /home/app/src/config
COPY --from=builder /home/temp/.env.production.local /home/app/.env.production.local
ENV NODE_ENV=production
# 直接运行编译后的二进制文件
CMD ["./web_server"]