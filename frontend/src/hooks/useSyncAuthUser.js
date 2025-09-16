import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Hook that automatically creates/updates user in local database
 * after successful Auth0 authentication. Uses the new reliable approach.
 */
export default function useSyncAuthUser() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    let ignore = false;

    async function createOrUpdateUser() {
      if (!isAuthenticated || !user) return;
      
      try {
        const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
        const token = await getAccessTokenSilently({ audience });
        
        if (!token) {
          console.warn('No access token available for user creation');
          return;
        }

        // Try the new create-user endpoint first (more reliable)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: user.email,
            firstName: user.given_name || user.name?.split(' ')[0],
            lastName: user.family_name || user.name?.split(' ').slice(1).join(' ')
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('User created/updated successfully:', result.user);
        } else {
          // Fallback to sync endpoint if create-user fails
          console.log('Create-user failed, trying sync endpoint...');
          const syncResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json();
            console.log('User synced successfully:', syncResult.user);
          } else {
            throw new Error(`Both endpoints failed: create-user(${response.status}), sync(${syncResponse.status})`);
          }
        }
        
      } catch (error) {
        console.error('Failed to create/update user in local database:', error);
        // Don't show error to user - this is a background operation
      }
    }

    // Small delay to ensure token is fully available
    const timer = setTimeout(() => {
      if (!ignore) {
        createOrUpdateUser();
      }
    }, 1000);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [isAuthenticated, user, getAccessTokenSilently]);
}
