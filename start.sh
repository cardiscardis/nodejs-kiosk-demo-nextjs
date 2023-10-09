#!/bin/bash

if [ ! -e .env ] || [ ! -e application.yaml ]; then
    echo "Please read README.md and follow running instructions"
    exit 1
fi

if [ ! -d node_modules ]; then
    npm install
    npm run build
fi

if [ ! -e prisma/*.db ]; then
    npx prisma migrate deploy
fi

npm run dev