import { debug, setFailed } from '@actions/core';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import {
  getSanitisedInvalidationPaths,
  invalidateCloudFrontCacheWithPaths,
} from './cloudfront.js';

import { getInputs } from './inputs.js';

export async function run(): Promise<void> {
  try {
    const inputs = getInputs();

    debug(`Inputs:\n${JSON.stringify(inputs, null, 2)}`);

    const cloudFrontClient = new CloudFrontClient({
      region: inputs.region,
    });

    const sanitisedInvalidatePaths = getSanitisedInvalidationPaths(
      inputs.invalidatePaths.split(',').filter(Boolean),
      inputs.originPrefix,
      inputs.defaultRootObject
    );

    await invalidateCloudFrontCacheWithPaths(
      cloudFrontClient,
      inputs.distributionId,
      sanitisedInvalidatePaths
    );
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('Unknown error');
    }
  }
}

void run();
