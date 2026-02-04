/**
 * Rate limit queue with exponential backoff retry
 */

import type { QueuedRequest } from './types';

export class RateLimitQueue {
  private queue: QueuedRequest<unknown>[] = [];
  private processing = false;
  private requestsPerSecond: number;
  private minInterval: number;
  private lastRequestTime = 0;

  constructor(requestsPerSecond: number) {
    this.requestsPerSecond = requestsPerSecond;
    this.minInterval = 1000 / requestsPerSecond;
  }

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        execute: request as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minInterval) {
        await this.sleep(this.minInterval - timeSinceLastRequest);
      }

      const queuedRequest = this.queue.shift();
      if (!queuedRequest) break;

      this.lastRequestTime = Date.now();

      try {
        const result = await this.executeWithRetry(queuedRequest.execute);
        queuedRequest.resolve(result);
      } catch (error) {
        queuedRequest.reject(error as Error);
      }
    }

    this.processing = false;
  }

  private async executeWithRetry<T>(
    request: () => Promise<T>,
    retryCount = 0,
    maxRetries = 3
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      const isRateLimitError =
        error instanceof Error &&
        'status' in error &&
        (error as { status?: number }).status === 429;

      if (isRateLimitError && retryCount < maxRetries) {
        const backoffDelay = Math.pow(2, retryCount) * 1000;
        console.warn(
          `Rate limit hit, retrying in ${backoffDelay}ms (attempt ${retryCount + 1}/${maxRetries})`
        );
        await this.sleep(backoffDelay);
        return this.executeWithRetry(request, retryCount + 1, maxRetries);
      }

      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      requestsPerSecond: this.requestsPerSecond,
      minInterval: this.minInterval,
    };
  }

  clear(): void {
    this.queue = [];
    this.processing = false;
  }
}

export const jobPostingsQueue = new RateLimitQueue(10);
export const careerPathwaysQueue = new RateLimitQueue(5);
