import { getStorage, updateSettings } from '../core/storage';

const enabledEl = document.getElementById('enabled') as HTMLInputElement;
const openOptionsEl = document.getElementById('openOptions') as HTMLButtonElement;

async function bootstrap(): Promise<void> {
  const state = await getStorage();
  enabledEl.checked = state.settings.enabled;
}

enabledEl.addEventListener('change', async () => {
  await updateSettings({
    enabled: enabledEl.checked
  });
});

openOptionsEl.addEventListener('click', () => {
  void chrome.runtime.openOptionsPage();
});

void bootstrap();