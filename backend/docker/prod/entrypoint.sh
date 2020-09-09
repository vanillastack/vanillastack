#!/bin/bash

# Start backend
cd "/usr/workdir"
echo "Starting backend"
npm run dockerdetached -D
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi

# Prep and Start nginx
echo "Starting nginx"
envsubst '${NGINX_PORT}' </etc/nginx/templates/vsnginx.conf.template >/etc/nginx/conf.d/vsnginx.conf
/etc/init.d/nginx restart -D
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_second_process: $status"
  exit $status
fi

while sleep 15; do
  ps aux | grep nginx | grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux | grep src/bin/www | grep -q -v grep
  PROCESS_2_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit 1
  fi
done
