import * as faceapi from 'face-api.js';

export class FaceModelManager {
  private initialized = false;

  public async init(modelPath: string): Promise<void> {
    if (this.initialized) {
      return;
    }

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
    ]);

    this.initialized = true;
  }

  public async extractFaceDescriptors(
    image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  ): Promise<Float32Array[]> {
    const detections = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 416 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections.map((item) => item.descriptor);
  }
}
