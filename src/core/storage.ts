import { DEFAULT_SETTINGS, STORAGE_KEY } from './constants';
import type { ExtensionStorage, FaceProfile, ExtensionSettings } from './types';

export async function getStorage(): Promise<ExtensionStorage> {
  const raw = await chrome.storage.local.get(STORAGE_KEY);
  const value = raw[STORAGE_KEY] as ExtensionStorage | undefined;

  if (!value) {
    const initial: ExtensionStorage = {
      settings: DEFAULT_SETTINGS,
      profiles: []
    };
    await setStorage(initial);
    return initial;
  }

  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...value.settings
    },
    profiles: value.profiles ?? []
  };
}

export async function setStorage(payload: ExtensionStorage): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEY]: payload
  });
}

export async function updateSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  const current = await getStorage();
  await setStorage({
    ...current,
    settings: {
      ...current.settings,
      ...settings
    }
  });
}

export async function upsertProfile(profile: FaceProfile): Promise<void> {
  const current = await getStorage();
  const others = current.profiles.filter((item) => item.id !== profile.id);
  await setStorage({
    ...current,
    profiles: [...others, profile]
  });
}

export async function deleteProfile(profileId: string): Promise<void> {
  const current = await getStorage();
  await setStorage({
    ...current,
    profiles: current.profiles.filter((item) => item.id !== profileId)
  });
}
