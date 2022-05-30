#!/usr/bin/env bash

beeJsVersion=$1

if [ -z "$beeJsVersion" ]; then
    echo "No bee-js version!"
    exit 1
fi

find . -name 'package.json' -maxdepth 2 -type f -print0 | while read -d $'\0' file
do
  echo "Updating: ${file}"

  # For entries that does NOT have `,` in the end of the line
  sed -i '' "s/\"@ethersphere\/bee-js\": \".*\"$/\"@ethersphere\/bee-js\": \"${beeJsVersion}\"/g" "$file"

  # For entries that DOES have `,` in the end of the line
  sed -i '' "s/\"@ethersphere\/bee-js\": \".*\",$/\"@ethersphere\/bee-js\": \"${beeJsVersion}\",/g" "$file"

  cd $(dirname $file) || exit
  npm install --silent
  cd ..
done
