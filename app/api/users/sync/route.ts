import { NextRequest, NextResponse } from 'next/server';

interface UserSyncData {
  googleId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  provider: string | undefined;
  providerId: string | undefined;
  lastLogin: string;
}

export async function POST(request: NextRequest) {
  try {
    const userData: UserSyncData = await request.json();

    console.log('Syncing user data:', userData);

    // Validate required fields
    if (!userData.googleId || !userData.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required user data' },
        { status: 400 }
      );
    }

    // Send to your backend using the Google auth endpoint
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleId: userData.googleId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.image,
        provider: userData.provider,
        providerId: userData.providerId,
        lastLogin: userData.lastLogin,
      }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend response error:', errorText);
      
      // Handle specific backend errors
      if (backendResponse.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      } else if (backendResponse.status === 403) {
        throw new Error('Access denied. Your account may not have the required permissions.');
      } else if (backendResponse.status === 404) {
        throw new Error('User service not found. Please contact support.');
      } else if (backendResponse.status === 409) {
        throw new Error('User already exists. Please try signing in instead.');
      } else if (backendResponse.status >= 500) {
        throw new Error('Server error occurred. Please try again later.');
      } else {
        throw new Error(`Backend error (${backendResponse.status}): ${errorText}`);
      }
    }

    const backendData = await backendResponse.json();
    console.log('Backend sync successful:', backendData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User synced successfully',
      user: backendData 
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to sync user data'
      },
      { status: 500 }
    );
  }
}