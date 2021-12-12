import { getInput } from '@actions/core';

export function getInputs() {
  const invalidatePaths =
    getInput('invalidatePaths', {
      required: false,
      trimWhitespace: true,
    }) || '';

  const distributionId = getInput('distributionId', {
    required: true,
    trimWhitespace: true,
  });

  const originPrefix =
    getInput('originPrefix', {
      required: false,
      trimWhitespace: true,
    }) || '';

  const defaultRootObject = getInput('defaultRootObject', {
    required: true,
    trimWhitespace: true,
  });

  const region = getInput('awsRegion', {
    required: true,
    trimWhitespace: true,
  });

  const includeOriginPrefix =
    getInput('includeOriginPrefix', {
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
