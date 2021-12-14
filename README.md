# AWS CloudFront GitHub Action

[![Build & Test](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/test.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/test.yml)
[![Deploy](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/deploy.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/badsyntax/github-action-aws-cloudfront/actions/workflows/codeql-analysis.yml)

A GitHub Action to invalidate a list of CloudFront paths.

The Action will generate a new list based on input options. This is especially helpful when you're piping in origin paths (eg from an S3 Action) that need to be transformed into absolute URL paths from root. You can also include origin prefixes to cache-bust URL's rewritten by Lambda's (in which case you need to invalidate both the `viewer-request` and rewritten URL's). A root slash `/` is added if a url matches the `default-root-object`.

## Example Path Transformations

| input                                 | prefix   | include-origin-prefix | default-root-object | output                                                      |
| ------------------------------------- | -------- | --------------------- | ------------------- | ----------------------------------------------------------- |
| `index.html,blog.html,css/styles.css` | `(none)` | `false`               | `index.html`        | `/index.html,/blog.html,/css/styles.css,/`                  |
| `root/index,/root/css/styles.css,/`   | `root`   | `false`               | `index`             | `/index,/css/styles.css,/`                                  |
| `root/index,root/css/styles.css`      | `root`   | `true`                | `index`             | `/index,/root/index,/css/styles.css,/root/css/styles.css,/` |

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

      - uses: badsyntax/github-action-aws-cloudfront@v0.0.2
        name: Invalidate CloudFront Cache
        id: invalidate-cloudfront-cache
        with:
          distribution-id: ${{ secrets.CFDistributionId }}
          aws-region: 'us-east-1'
          origin-prefix: 'root'
          include-origin-prefix: true
          invalidate-paths: '/index.html,/'
          default-root-object: 'index.html'
```

## Action Inputs

| key                     | description                                                                                                                                                                                                                                                              | example                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `invalidate-paths`      | Comma separated list of invalidation paths                                                                                                                                                                                                                               | `root/blog.html,root/index.html` |
| `distribution-id`       | The CloudFront Distribution Id                                                                                                                                                                                                                                           | `ABC123DEF`                      |
| `origin-prefix`         | The prefix of the object location in origin, which will be optionally stripped from the invalidation paths, if `include-origin-prefix` is false. For example if origin-prefix is "root" and invalidationPath is "root/blog.html" then the final path will be "blog.html" | `root`                           |
| `include-origin-prefix` | Whether to include origin prefix paths. Useful when paths ere rewritten by Lambda's                                                                                                                                                                                      | `true`                           |
| `default-root-object`   | The object returned when a user requests the root URL for your distribution. If this path is invalidated then a slash (/) is added to the invalidation paths                                                                                                             | `index.html`                     |
| `aws-region`            | The AWS region                                                                                                                                                                                                                                                           | `us-east-1`                      |

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
