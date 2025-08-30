import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Hook that automatically syncs Auth0 user data to our local database
 * after successful authentication. This ensures our Contact_Details table
 * stays in sync with Auth0 user profiles.
 */
export default function useSyncAuthUser() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    let ignore = false;

    async function syncUser() {
      if (!isAuthenticated || !user) return;
      
      try {
        const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
        const token = await getAccessTokenSilently({ audience });
        
        if (!token) {
          console.warn('No access token available for user sync');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Sync failed: ${response.status}`);
        }

        const result = await result.json();
        console.log('User synced successfully:', result.user);
        
      } catch (error) {
        console.error('Failed to sync user to local database:', error);
        // Don't show error to user - this is a background sync
      }
    }

    // Small delay to ensure token is fully available
    const timer = setTimeout(() => {
      if (!ignore) {
        syncUser();
      }
    }, 1000);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [isAuthenticated, user, getAccessTokenSilently]);
}
