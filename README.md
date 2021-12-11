# AWS CloudFront GitHub Action

[![Build & Test](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/test.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/test.yml)
[![Deploy](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/deploy.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/codeql-analysis.yml)

## Motivation

I need a quick and easy way to invalidate a list of paths.

## Features

- Invalidate paths

## Getting Started

Please read: <https://github.com/aws-actions/configure-aws-credentials#credentials>

```yaml
name: 'Deploy'

concurrency:
  group: prod_deploy
  cancel-in-progress: false

on:
  repository_dispatch:
  workflow_dispatch:
  pull_request:
    types: [opened, synchronize, reopened, closed]
  push:
    branches:
      - master

jobs:
  deploy:
    name: 'Deploy'
    runs-on: ubuntu-20.04
    if: github.actor != 'dependabot[bot]' && (github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository)
    steps:
      - uses: actions/checkout@v2

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - uses: badsyntax/github-action-aws-cloudfront@v0.0.1
        name: Invalidate CloudFront Cache
        id: invalidate-cloudfront-cache
        with:
          distributionId: ${{ secrets.CFDistributionId }}
          awsRegion: 'us-east-1'
          originPrefix: 'root'
          invalidatePaths: '/index.html,/'
          defaultRootObject: 'index.html'
```

## Related Projects

- [github-action-aws-cloudformation](https://github.com/badsyntax/github-action-aws-cloudformation)
- [github-action-aws-s3](https://github.com/badsyntax/github-action-aws-s3)

## Debugging

Check the Action output for logs.

If you need to see more verbose logs you can set `ACTIONS_STEP_DEBUG` to `true` as an Action Secret.

## License

See [LICENSE.md](./LICENSE.md).
