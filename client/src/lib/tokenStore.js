// Centralized localStorage access for auth state. Keeping every read/write
// behind this module means the rest of the app never touches localStorage
// keys directly, so the storage shape can change in one place.
const ACCESS_KEY = 'bundle.accessToken';
const REFRESH_KEY = 'bundle.refreshToken';
const USER_KEY = 'bundle.user';

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setSession: ({ accessToken, refreshToken, user }) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
