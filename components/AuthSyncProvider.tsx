'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useGoogleAuthMutation } from '@/Hooks/use.googleAuth.mutation';
import { TokenManager } from '@/utils/tokenManager';
import { SignInResponse } from '@/types/generated';

const AuthSyncProvider: React.FC = () => {
  const { data: session, status } = useSession();
  const { mutate: googleAuth } = useGoogleAuthMutation();

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user &&
      !TokenManager.hasToken()
    ) {
      const googleData = {
        email: session.user.email || '',
        avatar: session.user.image || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      };
      googleAuth(googleData, {
        onSuccess: (response: SignInResponse) => {
          const token = response?.token;
          if (token) {
            TokenManager.setToken(token, 'token');
          }
        },
        onError: (error: unknown) => {
          console.error('Google Auth mutation error:', error);
        }
      });
    }
  }, [status, session, googleAuth]);

  return null;
};

export default AuthSyncProvider;