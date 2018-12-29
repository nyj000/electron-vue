#! /bin/sh

git add .
git reset --hard HEAD
git checkout --track origin/dev
git pull


npm run build:darwin
npm run build:linux
npm run build:win32
cd build && rm -rf output && mkdir -p output
cd build && tar czvf hive-web-darwin.tar.gz hive-web-darwin-x64 && tar czvf hive-web-linux.tar.gz hive-web-linux-x64
cd build && tar czvf hive-web-win.tar.gz hive-web-win32-x64
cd build &&  mv *.tar.gz ~/build_workspace/download

