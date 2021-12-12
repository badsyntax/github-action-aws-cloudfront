import { describe, it, expect } from '@jest/globals';
import { getSanitisedInvalidationPaths } from '../cloudfront';

describe('getSanitisedInvalidationPaths', () => {
  const defaultRootObject = 'index.html';

  it('should generate correct sanitised paths', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      ['index.html', 'blog.html', 'css/styles.css'],
      '',
      defaultRootObject,
      false
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
      defaultRootObject,
      false
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
      defaultRootObject,
      false
    );
    expect(objectKeyWithoutExtension).toEqual([]);
  });

  it('should generate correct sanitised paths including origin prefix', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      ['root/index', '/root/css/styles.css', '/'],
      'root',
      defaultRootObject,
      true
    );
    expect(objectKeyWithoutExtension).toEqual([
      '/index',
      '/',
      '/root/index',
      '/css/styles.css',
      '/root/css/styles.css',
    ]);
  });
});
