import { describe, it, expect } from '@jest/globals';
import { getSanitisedInvalidationPaths } from '../cloudfront';

describe('getSanitisedInvalidationPaths', () => {
  const defaultRootObject = 'index.html';

  it('should generate correct sanitised paths', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      ['index.html', 'blog.html', 'css/styles.css'],
      '',
      defaultRootObject
    );
    expect(objectKeyWithoutExtension).toEqual([
      '/index.html',
      '/',
      '/blog.html',
      '/css/styles.css',
    ]);
  });

  it('should generate correct sanitised paths with prefixes', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      ['root/index', '/root/css/styles.css', '/'],
      'root',
      defaultRootObject
    );
    expect(objectKeyWithoutExtension).toEqual([
      '/index',
      '/',
      '/css/styles.css',
    ]);
  });

  it('should not generate any paths', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      [],
      'root',
      defaultRootObject
    );
    expect(objectKeyWithoutExtension).toEqual([]);
  });
});
