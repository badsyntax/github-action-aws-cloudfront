#!/usr/bin/env bash

INPUT_INVALIDATEPATHS="/,/index.html" \
    INPUT_ORIGINPREFIX="" \
    INPUT_AWSREGION="us-east-1" \
    INPUT_DEFAULTROOTOBJECT="index.html" \
    INPUT_CACHECONTROL="public,max-age=31536000,immutable" \
    GITHUB_EVENT_NAME="pull_request" \
    GITHUB_ACTION="synchronize" \
    GITHUB_REPOSITORY="badsyntax/github-action-aws-cloudfront" \
    GITHUB_WORKSPACE=$(pwd) \
    node lib/main.js
