

## Server setup

- MongoDB
- Redis

The easiest way to setup Redis is using a Docker
1. `docker pull redis`
2. `docker run --name fuschia-redis -p 6379:6379 -d redis`

The server uses SSL locally to allow for settings cookies for graphql testing. To setup local ssl follow the steps

1. `cd ./server/src`
2. `mkdir cert`
3. `cd cert`
4.  `openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365`
5. `openssl rsa -in keytmp.pem -out key.pem`

```
yarn
```