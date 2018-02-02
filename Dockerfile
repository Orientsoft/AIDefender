FROM registry.orientsoft.cn/orientsoft/nginx:1.13-alpine
MAINTAINER Timothy <yexiaozhou@orientsoft.cn>

RUN rm -rf /usr/share/nginx/html
ADD dist /usr/share/nginx/html
EXPOSE 80
