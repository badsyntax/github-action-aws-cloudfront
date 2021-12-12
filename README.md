# AWS CloudFront GitHub Action

[![Build & Test](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/test.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/test.yml)
[![Deploy](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/deploy.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/codeql-analysis.yml)

A GitHub Action to invalidate a list of CloudFront paths.

## Getting Started

Please read: <https://github.com/aws-actions/configure-aws-credentials#credentials>

```yaml
name: 'Deploy'

concurrency:
  group: prod_deploy
  cancel-in-progress: false

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: 'Invalidate Cache'
    runs-on: ubuntu-20.04
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
          includeOriginPrefix: true
          invalidatePaths: '/index.html,/'
          defaultRootObject: 'index.html'
```

## Action Inputs

| key                   | description                                                                                                                                                                                                                                                           | example                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `invalidatePaths`     | Comma separated list of invalidation paths                                                                                                                                                                                                                            | `root/blog.html,root/index.html` |
| `distributionId`      | The CloudFront Distribution Id                                                                                                                                                                                                                                        | `ABC123DEF`                      |
| `originPrefix`        | The prefix of the object location in origin, which will be optionally stripped from the invalidation paths, if `includeOriginPrefix` is false. For example if originPrefix is "root" and invalidationPath is "root/blog.html" then the final path will be "blog.html" | `root`                           |
| `includeOriginPrefix` | Whether to include origin prefix paths. Useful when paths ere rewritten by Lambda's                                                                                                                                                                                   | `true`                           |
| `defaultRootObject`   | The object returned when a user requests the root URL for your distribution. If this path is invalidated then a slash (/) is added to the invalidation paths                                                                                                          | `index.html`                     |
| `awsRegion`           | The AWS region                                                                                                                                                                                                                                                        | `us-east-1`                      |

## Cache Invalidation Gotchas

If you've specified the distribution `OriginPath` then this path must not exist in the invalidation path.

## Related GitHub Actions

- [badsyntax/github-action-aws-cloudformation](https://github.com/badsyntax/github-action-aws-cloudformation)
- [badsyntax/github-action-aws-s3](https://github.com/badsyntax/github-action-aws-s3)

## Debugging

Check the Action output for logs.

If you need to see more verbose logs you can set `ACTIONS_STEP_DEBUG` to `true` as an Action Secret.

## License

See [LICENSE.md](./LICENSE.md).
