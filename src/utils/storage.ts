import Cookies from 'js-cookie';
import { config } from '../config/constants';

const TOKEN_KEY = 'platzi_auth_token';
const REFRESH_TOKEN_KEY = 'platzi_refresh_token';
const TOKEN_EXPIRES_DAYS = 7;

function getCookieOptions(): Cookies.CookieAttributes {
  return {
    path: '/',
    expires: TOKEN_EXPIRES_DAYS,
    secure: config.app.isProduction,
    sameSite: 'strict',
  };
}

export const storage = {
  getToken: (): string | null => {
    try {
      return Cookies.get(TOKEN_KEY) || null;
    } catch (error) {
      console.error('Failed to get token from cookies:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      Cookies.set(TOKEN_KEY, token, getCookieOptions());
    } catch (error) {
      console.error('Failed to set token in cookies:', error);
      throw new Error('Failed to store authentication token');
    }
  },

  getRefreshToken: (): string | null => {
    try {
      return Cookies.get(REFRESH_TOKEN_KEY) || null;
    } catch (error) {
      console.error('Failed to get refresh token from cookies:', error);
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      Cookies.set(REFRESH_TOKEN_KEY, token, getCookieOptions());
    } catch (error) {
      console.error('Failed to set refresh token in cookies:', error);
      throw new Error('Failed to store refresh token');
    }
  },

  clearTokens: (): void => {
    try {
      Cookies.remove(TOKEN_KEY, { path: '/' });
      Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
    } catch (error) {
      console.error('Failed to clear tokens from cookies:', error);
    }
  },
};
