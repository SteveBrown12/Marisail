import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';
import axios from 'axios';

export default function useApiClient() {
  const { getAccessTokenSilently } = useAuth0();

  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    instance.interceptors.request.use(async (config) => {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
      const token = await getAccessTokenSilently({ audience });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getAccessTokenSilently]);

  return client;
}


