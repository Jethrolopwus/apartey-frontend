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
      throw new Error(`Backend responded with ${backendResponse.status}: ${errorText}`);
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