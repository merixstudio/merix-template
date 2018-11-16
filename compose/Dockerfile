FROM node:8 AS builder

RUN mkdir /code

WORKDIR /
ADD package.json /
ADD yarn.lock /
RUN yarn install
ENV PATH /node_modules/.bin:$PATH
WORKDIR /code/
ADD . /code/
RUN yarn production

FROM nginx:latest

ADD compose/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /code/_build/ /usr/share/nginx/html
