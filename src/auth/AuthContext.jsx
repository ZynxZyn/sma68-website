import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/services';
import { clearTokens, getToken, setTokens } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('sma68_refresh_token');
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        /* token already expired */
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password);
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (active) setUser(me);
      } catch {
        clearTokens();
      } finally {
        if (active) setLoading(false);
      }
    }
    hydrate();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onExpired() {
      setUser(null);
    }
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}