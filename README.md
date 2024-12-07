# UServer

## Debug And Run

```bash
yarn

yarn start 
### or ###
yarn serve
```
## Buil And Run

Basic build and run commands

```bash
yarn
yarn build
SERVER=debug node dist/main.cjs
```

Server build and run commands
```bash
yarn cache clean

cd /home/silienter/server/
git clone https://github.com/uys2000-projects/UServer userver-tmp

cp service.json userver-tmp/src/firebase/
cd userver-tmp
yarn
yarn build

cd ..
cp -r userver-tmp/dist userver
rm -rf userver-tmp

SERVER=rasp node userver/main.cjs
```