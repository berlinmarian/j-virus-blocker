import { describe, expect, test } from 'vitest';
import { euclideanDistance, minDistanceToProfile } from '../src/core/math';

describe('math', () => {
  test('euclideanDistance returns expected value', () => {
    const value = euclideanDistance([0, 0], [3, 4]);
    expect(value).toBe(5);
  });

  test('minDistanceToProfile returns null for empty profile', () => {
    const value = minDistanceToProfile(new Float32Array([1, 2]), []);
    expect(value).toBeNull();
  });

  test('minDistanceToProfile returns minimum of descriptors', () => {
    const probe = new Float32Array([1, 1]);
    const value = minDistanceToProfile(probe, [
      [5, 5],
      [1.1, 1.1],
      [2, 2]
    ]);

    expect(value).not.toBeNull();
    expect(value as number).toBeLessThan(0.2);
  });
});
