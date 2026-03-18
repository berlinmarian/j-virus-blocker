export type HideMode = 'remove' | 'blur';

export interface FaceProfile {
  id: string;
  name: string;
  descriptors: number[][];
  createdAt: string;
}

export interface ExtensionSettings {
  enabled: boolean;
  threshold: number;
  hideMode: HideMode;
  modelPath: string;
}

export interface ExtensionStorage {
  settings: ExtensionSettings;
  profiles: FaceProfile[];
}
