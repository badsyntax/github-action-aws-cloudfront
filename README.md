# AWS CloudFront GitHub Action

## Motivation

I need a quick and easy way to invalidate a list of paths.

## Features

- Invalidate paths

## Getting Started

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

      - uses: badsyntax/github-action-aws-cloudformation@v0.0.1
        name: Update CloudFormation Stack
        id: update-stack
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          stackName: 'static-example-richardwillis-cloudformation-stack'
          template: './cloudformation/cloudformation-s3bucket-example.yml'
          applyChangeSet: ${{ github.event_name != 'repository_dispatch' }}
          awsRegion: 'us-east-1'
          parameters: |
            S3BucketName=static-example-richardwillis-info-us-east-1&
            S3AllowedOrigins=https://static-example.richardwillis.info,https://*.preview.static-example.richardwillis.info&
            CloudFrontRootHosts=static-example.richardwillis.info&
            CertificateARN=arn:aws:acm:us-east-1:008215002370:certificate/39df7626-7d2f-42e9-94f4-a3ce61ca3d5e

      - uses: badsyntax/github-action-aws-s3@v0.0.1
        name: Sync mutable HTML files to S3
        id: sync-html-s3
        with:
          bucket: ${{ steps.update-stack.outputs.S3BucketName }}
          action: 'sync'
          srcDir: './out'
          filesGlob: '**/*.html'
          awsRegion: 'us-east-1'
          prefix: 'root'
          stripExtensionGlob: '**/**.html'
          cacheControl: 'public,max-age=0,s-maxage=31536000,must-revalidate'

      - uses: badsyntax/github-action-aws-s3@v0.0.1
        name: Sync immutable files to S3
        id: sync-immutable-s3
        with:
          bucket: ${{ steps.update-stack.outputs.S3BucketName }}
          action: 'sync'
          srcDir: './out'
          filesGlob: 'css/**'
          awsRegion: 'us-east-1'
          prefix: 'root'
          cacheControl: 'public,max-age=31536000,immutable'

      - uses: badsyntax/github-action-aws-cloudfront@v0.0.1
        name: Invalidate CloudFront Cache
        id: invalidate-cloudfront-cache
        with:
          distributionId: ${{ steps.update-stack.outputs.CFDistributionId }}
          awsRegion: 'us-east-1'
          originPrefix: 'root'
          invalidatePaths: ${{ steps.sync-html-s3.outputs.S3SyncedFiles }}
          defaultRootObject: 'index.html'
```

## Debugging

Check the Action output for logs.

If you need to see more verbose logs you can set `ACTIONS_STEP_DEBUG` to `true` as an Action Secret.

## License

See [LICENSE.md](./LICENSE.md).
