import { getStorage } from '../core/storage';

chrome.runtime.onInstalled.addListener(() => {
  void getStorage();
});
