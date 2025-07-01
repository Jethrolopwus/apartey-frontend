'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'

interface NextProviderProps {
  children: ReactNode
}

export default function NextProvider({ children }: NextProviderProps) {
  return (
    <Provider store={store}>
      <SessionProvider 
        // Only refetch when user actively interacts with the app
        refetchInterval={0} // Disable automatic refetching
        refetchOnWindowFocus={true} // Enable only on window focus
        refetchWhenOffline={false}
      >
        {children}
      </SessionProvider>
    </Provider>
  )
}