#!/bin/bash

if [ "$1" = "test" ]; then
    # Run tests
    if [ "$2" = "watch" ]; then
        docker-compose run --rm mars-rover npm run test:watch
    else
        docker-compose run --rm mars-rover npm test
    fi
elif [ "$1" ]; then
    # If a file argument is provided, run that specific file
    docker-compose run --rm mars-rover npm run run-file "src/$1"
else
    # Otherwise, start the development environment
    docker-compose up --build
fi