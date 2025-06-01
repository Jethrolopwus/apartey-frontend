
'use client'

import { useUserData } from '@/Hooks/useUserData';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const UserProfile = () => {
  const { userData, loading, error, sendUserDataToBackend } = useUserData();
  const [syncLoading, setSyncLoading] = useState(false);

  const handleManualSync = async () => {
    try {
      setSyncLoading(true);
      const result = await sendUserDataToBackend();
      alert('User data synced successfully!');
      console.log('Sync result:', result);
    } catch (error) {
      alert('Failed to sync user data: ' + (error as Error).message);
    } finally {
      setSyncLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={userData.image} 
          alt={userData.name}
          className="w-16 h-16 rounded-full border-2 border-gray-200"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
          <p className="text-gray-600">{userData.email}</p>
          <p className="text-sm text-gray-500">ID: {userData.id}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={handleManualSync}
          disabled={syncLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {syncLoading ? 'Syncing...' : 'Sync with Backend'}
        </button>
        
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {userData.accessToken && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">
            Access Token: {userData.accessToken.substring(0, 20)}...
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;