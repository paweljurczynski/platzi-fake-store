import { describe, it, expect, beforeEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import { storage } from '../storage';

vi.mock('js-cookie', () => {
  const cookies: Record<string, string> = {};
  
  return {
    default: {
      get: (name: string) => cookies[name] || undefined,
      set: (name: string, value: string) => {
        cookies[name] = value;
      },
      remove: (name: string) => {
        delete cookies[name];
      },
    },
  };
});

describe('storage', () => {
  beforeEach(() => {
    Cookies.remove('platzi_auth_token');
    Cookies.remove('platzi_refresh_token');
  });

  it('should set and get token', () => {
    const token = 'test-token';
    storage.setToken(token);
    expect(storage.getToken()).toBe(token);
  });

  it('should set and get refresh token', () => {
    const refreshToken = 'test-refresh-token';
    storage.setRefreshToken(refreshToken);
    expect(storage.getRefreshToken()).toBe(refreshToken);
  });

  it('should clear all tokens', () => {
    storage.setToken('token');
    storage.setRefreshToken('refresh-token');
    storage.clearTokens();
    expect(storage.getToken()).toBeNull();
    expect(storage.getRefreshToken()).toBeNull();
  });

  it('should return null when token does not exist', () => {
    expect(storage.getToken()).toBeNull();
    expect(storage.getRefreshToken()).toBeNull();
  });
});

