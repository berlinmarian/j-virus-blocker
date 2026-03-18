import type { HideMode } from './types';

const TWEET_SELECTOR = 'article[data-testid="tweet"]';
const IMAGE_SELECTOR = 'img[src*="pbs.twimg.com"]';
const PROCESSED_FLAG = 'data-face-filter-processed';

export function findTweetArticles(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TWEET_SELECTOR));
}

export function findTweetImages(tweet: ParentNode): HTMLImageElement[] {
  return Array.from(tweet.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR));
}

export function isProcessed(tweet: HTMLElement): boolean {
  return tweet.getAttribute(PROCESSED_FLAG) === '1';
}

export function markProcessed(tweet: HTMLElement): void {
  tweet.setAttribute(PROCESSED_FLAG, '1');
}

export function hideTweet(tweet: HTMLElement, mode: HideMode): void {
  if (mode === 'blur') {
    tweet.style.filter = 'blur(20px)';
    tweet.style.pointerEvents = 'none';
    tweet.style.userSelect = 'none';
    return;
  }

  tweet.style.display = 'none';
}
