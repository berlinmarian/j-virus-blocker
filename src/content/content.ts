import { FaceModelManager } from '../core/model';
import { minDistanceToProfile } from '../core/math';
import { getStorage } from '../core/storage';
import {
  findTweetArticles,
  findTweetImages,
  hideTweet,
  isProcessed,
  markProcessed
} from '../core/tweetFilter';

const modelManager = new FaceModelManager();
let isInitialized = false;

async function initialize(): Promise<void> {
  if (isInitialized) {
    return;
  }

  const state = await getStorage();
  if (!state.settings.enabled || state.profiles.length === 0) {
    isInitialized = true;
    return;
  }

  const modelUrl = chrome.runtime.getURL(state.settings.modelPath);
  await modelManager.init(modelUrl);
  isInitialized = true;
}

async function processTweet(tweet: HTMLElement): Promise<void> {
  const state = await getStorage();
  if (!state.settings.enabled || state.profiles.length === 0) {
    return;
  }

  const images = findTweetImages(tweet);
  for (const image of images) {
    if (!image.complete) {
      await image.decode().catch(() => undefined);
    }

    const descriptors = await modelManager.extractFaceDescriptors(image);
    for (const descriptor of descriptors) {
      for (const profile of state.profiles) {
        const distance = minDistanceToProfile(descriptor, profile.descriptors);
        if (distance !== null && distance <= state.settings.threshold) {
          hideTweet(tweet, state.settings.hideMode);
          return;
        }
      }
    }
  }
}

async function scanTimeline(): Promise<void> {
  await initialize();

  const tweets = findTweetArticles();
  for (const tweet of tweets) {
    if (isProcessed(tweet)) {
      continue;
    }

    markProcessed(tweet);
    await processTweet(tweet).catch(() => undefined);
  }
}

function bootstrapObserver(): void {
  const observer = new MutationObserver(() => {
    void scanTimeline();
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true
  });
}

void scanTimeline();
bootstrapObserver();
