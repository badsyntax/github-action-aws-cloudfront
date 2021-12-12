import { describe, it, expect } from '@jest/globals';
import { getSanitisedInvalidationPaths } from '../cloudfront';

describe('getSanitisedInvalidationPaths', () => {
  it('should generate correct sanitised paths', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      ['index.html', 'blog.html', 'css/styles.css'],
      '',
      'index.html',
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
      'index',
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
      'index.html',
      false
    );
    expect(objectKeyWithoutExtension).toEqual([]);
  });

  it('should generate correct sanitised paths including origin prefix', () => {
    const objectKeyWithoutExtension = getSanitisedInvalidationPaths(
      ['root/index', 'root/css/styles.css', '/'],
      'root',
      'index',
      true
    );
    expect(objectKeyWithoutExtension).toEqual([
      '/index',
      '/',
      '/root/index',
      '/root/',
      '/css/styles.css',
      '/root/css/styles.css',
    ]);
  });
});
