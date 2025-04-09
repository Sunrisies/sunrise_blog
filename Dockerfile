FROM alpine:latest AS production
RUN apk add --no-cache --update nodejs-current openssl font-droid-nonlatin 


# 创建一个文件夹，把下面的内容都放进去
WORKDIR /home/app
COPY dist1 /home/app/dist
# 进入到node_modules/qiniu包下，删除node_modules，以免体积过大
# RUN rm -rf /home/app/node_modules/qiniu/node_modules

CMD [ "node", "/home/app/dist/index.js" ]