import { describe, expect, test } from 'vitest';
import { findTweetArticles, findTweetImages, hideTweet, markProcessed, isProcessed } from '../src/core/tweetFilter';

describe('tweetFilter', () => {
  test('findTweetArticles finds tweet containers', () => {
    document.body.innerHTML = `
      <article data-testid="tweet"></article>
      <article data-testid="tweet"></article>
      <div></div>
    `;

    const tweets = findTweetArticles();
    expect(tweets).toHaveLength(2);
  });

  test('findTweetImages finds pbs images only', () => {
    document.body.innerHTML = `
      <article data-testid="tweet" id="t1">
        <img src="https://pbs.twimg.com/media/a.jpg" />
        <img src="https://example.com/b.jpg" />
      </article>
    `;

    const tweet = document.getElementById('t1') as HTMLElement;
    const images = findTweetImages(tweet);
    expect(images).toHaveLength(1);
  });

  test('markProcessed and isProcessed work together', () => {
    const tweet = document.createElement('article');
    expect(isProcessed(tweet)).toBe(false);
    markProcessed(tweet);
    expect(isProcessed(tweet)).toBe(true);
  });

  test('hideTweet remove mode hides element', () => {
    const tweet = document.createElement('article');
    hideTweet(tweet, 'remove');
    expect(tweet.style.display).toBe('none');
  });

  test('hideTweet blur mode keeps layout but blurs', () => {
    const tweet = document.createElement('article');
    hideTweet(tweet, 'blur');
    expect(tweet.style.filter).toContain('blur');
  });
});
