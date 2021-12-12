import { info } from '@actions/core';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
  InvalidationBatch,
} from '@aws-sdk/client-cloudfront';

import { defaultDelayMs } from './constants.js';
import { delay } from './util.js';

async function waitForInvalidationToComplete(
  client: CloudFrontClient,
  distributionId: string,
  invalidationId: string,
  delayMs = defaultDelayMs
): Promise<void> {
  const output = await client.send(
    new GetInvalidationCommand({
      Id: invalidationId,
      DistributionId: distributionId,
    })
  );
  if (output.Invalidation?.Status !== 'Completed') {
    info(`InvalidationStatus: ${output.Invalidation?.Status}`);
    await delay(delayMs);
    return waitForInvalidationToComplete(
      client,
      distributionId,
      invalidationId,
      delayMs
    );
  }
}

export function getSanitisedInvalidationPaths(
  invalidatePaths: string[], // eg ['/root/index', 'root/css/styles.css']
  originPrefix: string, // eg root
  defaultRootObject: string, // eg 'index.html'
  includeOriginPrefix: boolean
): string[] {
  const paths = invalidatePaths
    .map((path) => {
      if (!path.startsWith('/')) {
        return `/${path}`;
      }
      return path;
    })
    .map((path) => {
      if (originPrefix) {
        const pathWithoutOrigin = path.replace(`/${originPrefix}`, '');
        if (includeOriginPrefix) {
          return [pathWithoutOrigin, path];
        } else {
          return pathWithoutOrigin;
        }
      }
      return path;
    })
    .flat()
    .map((path) => {
      if (path === `/${defaultRootObject}`) {
        return [path, '/'];
      }
      return path;
    })
    .flat();
  return [...new Set(paths)];
}

export async function invalidateCloudFrontCacheWithPaths(
  client: CloudFrontClient,
  distributionId: string,
  paths: string[]
): Promise<void> {
  if (!paths.length) {
    info('(No paths to invalidate)');
  } else {
    info('Requesting a Cloudfront Cache Invalidation for the following paths:');
    info(`${JSON.stringify(paths, null, 2)}`);
    const invalidationBatch: InvalidationBatch = {
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
      CallerReference: `invalidate-paths-${Date.now()}`,
    };
    const output = await client.send(
      new CreateInvalidationCommand({
        InvalidationBatch: invalidationBatch,
        DistributionId: distributionId,
      })
    );
    if (!output.Invalidation?.Id) {
      throw new Error('Invalid InvalidationCommand Output');
    }
    await waitForInvalidationToComplete(
      client,
      distributionId,
      output.Invalidation.Id
    );
    info(
      `Successfully invalidated CloudFront cache with ${paths.length} paths`
    );
  }
}
