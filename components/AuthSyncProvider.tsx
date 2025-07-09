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
    console.log('AuthSyncProvider useEffect:', { status, session, hasToken: TokenManager.hasToken() });
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
            console.log('Token set in localStorage:', token);
          } else {
            console.error('No token found in backend response:', response);
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