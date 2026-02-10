/**
 * Lightcast OAuth2 Client - Auto-refresh token with 55min cache
 */

import { lightcastCache, CACHE_TTL } from './cache';
import type { LightcastAuthResponse, CachedToken, LightcastError } from './types';

const AUTH_URL = process.env.LIGHTCAST_AUTH_URL || 'https://auth.emsicloud.com/connect/token';
const API_BASE_URL = process.env.LIGHTCAST_API_BASE_URL || 'https://api.lightcast.io';
const CLIENT_ID = process.env.LIGHTCAST_CLIENT_ID || '';
const CLIENT_SECRET = process.env.LIGHTCAST_CLIENT_SECRET || '';
const SCOPE = 'postings:us career-pathways';

class LightcastClient {
  private tokenCacheKey = 'lightcast:token';

  async getAccessToken(): Promise<string> {
    const cachedToken = lightcastCache.get<CachedToken>(this.tokenCacheKey);

    if (cachedToken && Date.now() < cachedToken.refreshAt) {
      return cachedToken.token;
    }

    return this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<string> {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: SCOPE,
    });

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = (await response.json()) as LightcastError;
        throw new Error(`Authentication failed: ${error.errors?.title || response.statusText}`);
      }

      const data = (await response.json()) as LightcastAuthResponse;

      const now = Date.now();
      const expiresIn = data.expires_in * 1000;
      const refreshBuffer = 5 * 60 * 1000; // Refresh 5 minutes before expiry

      const cachedToken: CachedToken = {
        token: `Bearer ${data.access_token}`,
        expiresAt: now + expiresIn,
        refreshAt: now + expiresIn - refreshBuffer,
        scope: SCOPE,
      };

      lightcastCache.set(this.tokenCacheKey, cachedToken, CACHE_TTL.TOKEN);
      return cachedToken.token;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as any;

      if (response.status === 429) {
        const rateLimitError = new Error('Rate limit exceeded') as Error & { status: number };
        rateLimitError.status = 429;
        throw rateLimitError;
      }

      console.error('Lightcast API Error:', {
        status: response.status,
        url: url,
        error: error,
        fullError: JSON.stringify(error, null, 2)
      });

      // Handle both array and object error formats
      let errorMessage = response.statusText;
      if (error.errors) {
        if (Array.isArray(error.errors) && error.errors.length > 0) {
          errorMessage = error.errors[0].detail || error.errors[0].title || response.statusText;
        } else if (error.errors.detail || error.errors.title) {
          errorMessage = error.errors.detail || error.errors.title;
        }
      }

      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  clearToken(): void {
    lightcastCache.delete(this.tokenCacheKey);
  }
}

export const lightcastClient = new LightcastClient();
