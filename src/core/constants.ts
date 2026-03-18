import type { ExtensionSettings } from './types';

export const STORAGE_KEY = 'tweetFaceFilter';

export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  threshold: 0.47,
  hideMode: 'remove',
  modelPath: 'models'
};
