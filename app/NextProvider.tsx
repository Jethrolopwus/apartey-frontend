'use client';
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export default function NextProvider({ children }: ProvidersProps) {
  return <SessionProvider refetchInterval={5 * 60} 
  refetchOnWindowFocus={true}
  refetchWhenOffline={false}>{children}</SessionProvider>
}