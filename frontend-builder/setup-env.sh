#!/bin/bash
if [ ! -f ./.env ]; then
  echo -e "What is your GraphQL Endpoint? [default: https://localhost:4003]? "
  read myEndpoint
  if [ $myEndpoint == ""]; then
    myEndpoint="http://localhost:4002"
  fi
  echo "REACT_APP_GQL_ENDPOINT=$myEndpoint" >>./.env
  echo -e "Writing $myEndpoint to .env file..."
else
  echo -e ".env file already exists."
fi
