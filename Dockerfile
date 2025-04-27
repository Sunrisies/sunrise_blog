# 多阶段构建示例
FROM node:alpine AS builder
WORKDIR /home/temp
COPY dist1 /home/temp/dist
COPY src/config /home/temp/src/config
RUN npm config set registry https://registry.npmmirror.com/ && npm i @yao-pkg/pkg -g
RUN pkg /home/temp/dist/index.js --target=node22 --platform=alpine --output=web_server


FROM alpine:latest AS production
# 从builder阶段复制编译结果
COPY --from=builder /home/temp/web_server /home/app/
# 复制配置文件（保持原有结构）
COPY --from=builder /home/temp/src/config /home/app/src/config

WORKDIR /home/app
# 直接运行编译后的二进制文件
CMD ["./web_server"]