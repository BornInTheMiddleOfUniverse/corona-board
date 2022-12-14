#!/bin/bash

git pull
npm install
(cd ../tools && node build/main.js)

NODE_OPTIONS='--max-old-space-size=1536' gatsby build


# public 폴더 안의 *.html, *.json 파일은 웹브라우저에서 캐시하지 않고 매번 서버에 새 파일이 있는지 확인 요청하도록 설정
# cache-control: public, max-age=0, must-revalidate

aws s3 sync \
--acl public-read \
--cache-control public,max-age=0,must-revalidate \
--exclude "*" \
--include "*.html" --include "*.json" \
--delete \
./public s3://coronacoronaboard

# html, json을 제외한 모든 파일은 웹브라우저에서 1년간 캐시하도록 설정
# 웹사이트 코드를 수정하다보면 js나 css 파일은 종종 바뀌는데 캐시해도 되는지?
# - 바뀐 코드의 내용에따라 빌드되어 생성된 js, css 파일 이름에 해시(hash)값이 자동으로 붙기 때문에 내용이 변경되면 이름도 바뀜
# 때문에 1년간 캐시해도 문제 없음
# cache-control: public, max-age=31536000, immutable

aws s3 sync \
--acl public-read \
--cache-control public,max-age=31536000,immutable \
--exclude "*.html" --exclude "*.json" \
--delete \
./public s3://coronacoronaboard