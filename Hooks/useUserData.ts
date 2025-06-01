
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface UserData {
  id: string;
  email: string;
  name: string;
  image: string;
  accessToken?: string;
}

interface UseUserDataReturn {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  sendUserDataToBackend: () => Promise<any>;
  refetchUserData: () => void;
}

export const useUserData = (): UseUserDataReturn => {
  const { data: session, status, update } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to manually send user data to backend
  const sendUserDataToBackend = async () => {
    if (!session?.user) {
      throw new Error('No user session available');
    }

    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          provider: 'google',
          lastLogin: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync user data');
      }

      const result = await response.json();
      console.log('User data sent to backend:', result);
      return result;
    } catch (error) {
      console.error('Error sending user data to backend:', error);
      throw error;
    }
  };

  // Function to refetch user data
  const refetchUserData = () => {
    update(); // This will trigger a session update
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserData({
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name!,
        image: session.user.image!,
        accessToken: session.accessToken,
      });
      setLoading(false);
      setError(null);
    } else if (status === 'unauthenticated') {
      setUserData(null);
      setLoading(false);
      setError(null);
    } else if (status === 'loading') {
      setLoading(true);
    }
  }, [session, status]);

  return { 
    userData, 
    loading, 
    error, 
    sendUserDataToBackend,
    refetchUserData
  };
};