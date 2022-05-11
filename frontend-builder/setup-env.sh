#!/bin/bash
DEFAULTHOST='https://localhost:4003'
if [ ! -f ./.env ]; then
  if [ -f ../backend-builder/.env ]; then
    echo -e "Note: /backend-builder/.env file detected. Grabbing configuration information..."
    TEMPPORT=$(cat ../backend-builder/.env | grep HTTPS_PORT= | cut -d '=' -f2)
    DEFAULTHOST="https://localhost:$TEMPPORT"
  fi

  echo -e "What is your GraphQL Endpoint? [default: $DEFAULTHOST]? "
  read myEndpoint
  if [ -z "$myEndpoint" ]; then
    myEndpoint=$DEFAULTHOST
  fi
  echo "REACT_APP_GQL_ENDPOINT=$myEndpoint" >>./.env
  echo -e "Writing $myEndpoint to .env file..."
else
  echo -e ".env file already exists."
fi
