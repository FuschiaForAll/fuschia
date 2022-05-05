#!/bin/bash
container_name="fuchsia-redis"
if [ "$(docker container inspect -f '{{.State.Status}}' $container_name)" != "running" ]; then
  sudo service docker start
  sleep 2
  docker start fuchsia-redis
fi
