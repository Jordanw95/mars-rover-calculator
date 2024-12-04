#!/bin/bash

if [ "$#" -eq 0 ]; then
    default_args="4 8 (2,3,E) LFRFF (0,2,N) FFLFRFF"
    echo "No arguments provided. Using default: $default_args"
    set -- $default_args
fi

# Run the entrypoint script with the provided or default arguments
docker-compose run --rm mars-rover npm run run-file "src/entrypoint.ts" -- "$@"