import { useState, useEffect } from 'react';
import { TokenManager } from '@/utils/tokenManager';

export function useAuthToken() {
  const [token, setToken] = useState(() => TokenManager.getToken());

  useEffect(() => {
    const checkToken = () => {
      setToken(TokenManager.getToken());
    };
    const interval = setInterval(checkToken, 400);
    const onStorage = (event: StorageEvent) => {
      if (event.key && ['authToken', 'token', 'accessToken'].includes(event.key)) {
        checkToken();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return token;
} 