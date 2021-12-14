import { getInput } from '@actions/core';

export function getInputs() {
  const invalidatePaths =
    getInput('invalidate-paths', {
      required: false,
      trimWhitespace: true,
    }) || '';

  const distributionId = getInput('distribution-id', {
    required: true,
    trimWhitespace: true,
  });

  const originPrefix =
    getInput('origin-prefix', {
      required: false,
      trimWhitespace: true,
    }) || '';

  const defaultRootObject = getInput('default-root-object', {
    required: true,
    trimWhitespace: true,
  });

  const region = getInput('aws-region', {
    required: true,
    trimWhitespace: true,
  });

  const includeOriginPrefix =
    getInput('include-origin-prefix', {
      required: true,
      trimWhitespace: true,
    }).toLowerCase() === 'true';

  return {
    invalidatePaths,
    distributionId,
    region,
    originPrefix,
    defaultRootObject,
    includeOriginPrefix,
  };
}
