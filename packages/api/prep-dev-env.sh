#!/bin/bash

JWT_SECRET=$(od -vAn -N32 -tx1 /dev/urandom | tr -d ' \n' | sed 's/../&:/g;s/:$//')

echo '' > .env
echo "DATABASE_URL=postgresql://postgres:password@localhost:5555/movie_manager_db" >> .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
