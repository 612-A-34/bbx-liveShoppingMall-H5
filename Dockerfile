FROM registry.baidubce.com/org/node:v12.13

WORKDIR /app

ADD . /app
RUN cd /app && npm install -g cnpm --registry=https://registry.npm.taobao.org  && cnpm install

EXPOSE 8003
CMD [ "npm", "run","local"]
