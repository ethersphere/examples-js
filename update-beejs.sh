#!/usr/bin/env bash

beeJsVersion=$1

if [ -z "$beeJsVersion" ]; then
    echo "No bee-js version!"
    exit 1
fi

find . -name 'package.json' -maxdepth 2 -type f -print0 | while read -d $'\0' file
do
  sed -i '' "s/\"@ethersphere\/bee-js\": \".*\",/\"@ethersphere\/bee-js\": \"^${beeJsVersion}\",/g" "$file"
  cd $(dirname $file) || exit
  npm install
  cd ..
done
