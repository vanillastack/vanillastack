# **VanillaStack Backend API**

## Requirements
Docker or Node.js installed

Got to VanillaStack/backend and execute docker build and run command

```shell script
cd VanillaStack/backend
docker build -f docker/dev/Dockerfile \ 
             -t vsbackend && docker run \
             --name vsbackend \
             -p 3000:3000 \
             -v $(pwd)/app:/usr/workdir/app vsbackend
```

or 

```shell script
cd VanillaStack/backend
npm install
npm run dev
```
