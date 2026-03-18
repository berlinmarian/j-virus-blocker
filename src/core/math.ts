export function euclideanDistance(a: Float32Array | number[], b: Float32Array | number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vector lengths are different.');
  }

  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

export function minDistanceToProfile(
  probe: Float32Array,
  profileDescriptors: number[][]
): number | null {
  if (profileDescriptors.length === 0) {
    return null;
  }

  let minDistance = Number.POSITIVE_INFINITY;
  for (const descriptor of profileDescriptors) {
    const distance = euclideanDistance(probe, descriptor);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
}
