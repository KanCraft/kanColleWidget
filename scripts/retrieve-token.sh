#!/bin/bash

source .env

url="https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${GOOGLEAPI_CLIENT_ID}&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
echo "Open the following URL in your browser:" ${url}
open ${url}

read -p "Enter the code: " CODE

if [ -z "$CODE" ]; then
    echo "Code is required"
    exit 1
fi

curl "https://accounts.google.com/o/oauth2/token" -d \
    "client_id=${GOOGLEAPI_CLIENT_ID}&client_secret=${GOOGLEAPI_CLIENT_SECRET}&code=${CODE}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
