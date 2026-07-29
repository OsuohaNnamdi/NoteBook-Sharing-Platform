import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { tokenStore } from '../lib/tokenStore';

const AuthContext = createContext(null);

// Services every new user is auto-enrolled for on registration. WRITE implies
// READ server-side, so CHAT gets WRITE (send + receive) while EDUTECH only
// needs READ (students browse courses; uploading is admin-only anyway).
const ONBOARDING_REQUESTS = [
  { service: 'CHAT', requestedLevel: 'WRITE', reason: 'Requested automatically on account registration.' },
  { service: 'EDUTECH', requestedLevel: 'READ', reason: 'Requested automatically on account registration.' },
];

function levelSatisfies(granted, required) {
  if (!granted) return false;
  if (granted === 'WRITE') return true;
  return granted === required;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [grants, setGrants] = useState([]);
  const [requests, setRequests] = useState([]);
  const [initializing, setInitializing] = useState(true);

  const loadAccessState = useCallback(async () => {
    const [grantList, requestList] = await Promise.all([userApi.myGrants(), userApi.myRequests()]);
    setGrants(grantList);
    setRequests(requestList);
  }, []);

  const bootstrap = useCallback(async () => {
    if (!tokenStore.getAccessToken()) {
      setInitializing(false);
      return;
    }
    try {
      const me = await userApi.me();
      setUser(me);
      tokenStore.setUser(me);
      await loadAccessState();
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, [loadAccessState]);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authApi.login({ email, password });
      tokenStore.setSession(data);
      setUser(data.user);
      await loadAccessState();
      return data.user;
    },
    [loadAccessState]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      tokenStore.setSession(data);
      setUser(data.user);

      // Fire off the onboarding access requests. These are best-effort —
      // if one fails (e.g. a duplicate), registration itself has already
      // succeeded, so we don't want to surface that as a hard error.
      const results = await Promise.allSettled(
        ONBOARDING_REQUESTS.map((req) => userApi.requestAccess(req))
      );
      await loadAccessState();
      return { user: data.user, onboarding: results };
    },
    [loadAccessState]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setGrants([]);
    setRequests([]);
  }, []);

  const hasAccess = useCallback(
    (service, requiredLevel = 'READ') => {
      if (!user) return false;
      if (user.role === 'ADMIN') return true;
      const grant = grants.find((g) => g.service === service);
      return levelSatisfies(grant?.level, requiredLevel);
    },
    [grants, user]
  );

  const requestStatusFor = useCallback(
    (service) => {
      const relevant = requests.filter((r) => r.service === service);
      if (!relevant.length) return null;
      // Most recent request wins (list comes back newest-first from the API).
      return relevant[0].status;
    },
    [requests]
  );

  const value = useMemo(
    () => ({
      user,
      grants,
      requests,
      initializing,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      hasAccess,
      requestStatusFor,
      refreshAccessState: loadAccessState,
    }),
    [user, grants, requests, initializing, login, register, logout, hasAccess, requestStatusFor, loadAccessState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
