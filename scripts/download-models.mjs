import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const destination = join(process.cwd(), 'public', 'models');

const files = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

await mkdir(destination, { recursive: true });

for (const file of files) {
  const url = `${baseUrl}/${file}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Model file download failed: ${url}`);
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  await writeFile(join(destination, file), buffer);
  console.log(`Downloaded: ${file}`);
}

console.log('Model download completed.');
