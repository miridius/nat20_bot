#!/bin/sh
UID=$(id -u) GID=$(id -g) docker compose up --build dev -d
docker compose logs -f dev