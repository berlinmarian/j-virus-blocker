import { DEFAULT_SETTINGS } from '../core/constants';
import { FaceModelManager } from '../core/model';
import { deleteProfile, getStorage, updateSettings, upsertProfile } from '../core/storage';

const modelManager = new FaceModelManager();

const enabledEl = document.getElementById('enabled') as HTMLInputElement;
const thresholdEl = document.getElementById('threshold') as HTMLInputElement;
const hideModeEl = document.getElementById('hideMode') as HTMLSelectElement;
const saveSettingsEl = document.getElementById('saveSettings') as HTMLButtonElement;
const profileNameEl = document.getElementById('profileName') as HTMLInputElement;
const photosEl = document.getElementById('photos') as HTMLInputElement;
const trainProfileEl = document.getElementById('trainProfile') as HTMLButtonElement;
const statusEl = document.getElementById('status') as HTMLParagraphElement;
const profilesEl = document.getElementById('profiles') as HTMLUListElement;

function setStatus(message: string): void {
  statusEl.textContent = message;
}

function createImageElement(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Görsel yüklenemedi.'));
    image.src = source;
  });
}

async function renderProfiles(): Promise<void> {
  const state = await getStorage();
  profilesEl.innerHTML = '';

  if (state.profiles.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'Henüz profil yok.';
    profilesEl.appendChild(item);
    return;
  }

  for (const profile of state.profiles) {
    const item = document.createElement('li');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Sil';
    removeButton.addEventListener('click', async () => {
      await deleteProfile(profile.id);
      await renderProfiles();
    });

    item.textContent = `${profile.name} - ${profile.descriptors.length} descriptor`;
    item.appendChild(document.createTextNode(' '));
    item.appendChild(removeButton);
    profilesEl.appendChild(item);
  }
}

async function bootstrap(): Promise<void> {
  const state = await getStorage();

  enabledEl.checked = state.settings.enabled;
  thresholdEl.value = String(state.settings.threshold);
  hideModeEl.value = state.settings.hideMode;

  const modelUrl = chrome.runtime.getURL(state.settings.modelPath);
  await modelManager.init(modelUrl);
  await renderProfiles();
}

saveSettingsEl.addEventListener('click', async () => {
  const threshold = Number(thresholdEl.value || DEFAULT_SETTINGS.threshold);
  await updateSettings({
    enabled: enabledEl.checked,
    threshold,
    hideMode: hideModeEl.value as 'remove' | 'blur'
  });

  setStatus('Ayarlar kaydedildi.');
});

trainProfileEl.addEventListener('click', async () => {
  const name = profileNameEl.value.trim();
  const files = photosEl.files;

  if (!name) {
    setStatus('Profil adı zorunlu.');
    return;
  }

  if (!files || files.length === 0) {
    setStatus('En az 1 fotoğraf seç.');
    return;
  }

  setStatus('Eğitim başlatıldı...');
  const descriptors: number[][] = [];

  for (const file of Array.from(files)) {
    const url = URL.createObjectURL(file);

    try {
      const image = await createImageElement(url);
      const found = await modelManager.extractFaceDescriptors(image);

      if (found.length > 0) {
        descriptors.push(Array.from(found[0]));
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  if (descriptors.length === 0) {
    setStatus('Yüz tespit edilemedi. Daha net fotoğraf dene.');
    return;
  }

  await upsertProfile({
    id: name.toLowerCase(),
    name,
    descriptors,
    createdAt: new Date().toISOString()
  });

  setStatus(`Profil kaydedildi: ${descriptors.length} descriptor`);
  await renderProfiles();
});

void bootstrap();
