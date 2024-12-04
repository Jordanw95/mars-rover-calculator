#!/bin/bash

if [ "$1" = "watch" ]; then
    # Run tests in watch mode
    docker-compose run --rm mars-rover npm run test:watch
else
    # Run tests normally
    docker-compose run --rm mars-rover npm test
fi 