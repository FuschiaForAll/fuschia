#!/bin/bash
DEFAULTHOST='http://localhost:4002/graphql'
if [ ! -f ./.env ]; then
  if [ -f ../backend-builder/.env ]; then
    echo -e "Note: /backend-builder/.env file detected. Grabbing configuration information..."
    TEMPPORT=$(cat ../backend-builder/.env | grep HTTP_PORT= | cut -d '=' -f2)
    DEFAULTHOST="http://localhost:$TEMPPORT/graphql"
  fi

  echo -e "What is your GraphQL Endpoint? [default: $DEFAULTHOST]? "
  read myEndpoint
  if [ -z "$myEndpoint" ]; then
    myEndpoint=$DEFAULTHOST
  fi
  echo "GQL_ENDPOINT=$myEndpoint" >>./.env
  echo -e "Writing $myEndpoint to .env file..."
else
  echo -e ".env file already exists."
fi
