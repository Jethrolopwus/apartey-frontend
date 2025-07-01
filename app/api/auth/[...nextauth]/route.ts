import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_AUTH_GOOGLE_ID!,
      clientSecret: process.env.NEXT_AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: { token: any; account?: any; user?: any }) {
      // Add access token and user id to JWT
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }
      if (user) {
        token.id = user.id;
        token.googleId = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add access token and user id to session
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.providerId = token.providerId;
      if (session.user) {
        session.user.id = token.id;
        session.user.googleId = token.googleId;
      }
      return session;
    },
    async signIn({ user, account, profile }: { user: any; account?: any; profile?: any }) {
      // Automatically sync user data with backend on sign in
      try {
        console.log('User signing in:', user);
        
        const userData = {
          googleId: user.id,
          email: user.email,
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          image: user.image,
          provider: account?.provider || 'google',
          providerId: account?.providerAccountId || user.email,
          lastLogin: new Date().toISOString(),
        };

        // Get the base URL for the sync endpoint
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        
        const response = await fetch(`${baseUrl}/api/users/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to sync user with backend:', errorText);
        } else {
          const result = await response.json();
          console.log('User synced successfully with backend:', result);
        }
        
        return true; // Continue with sign in
      } catch (error) {
        console.error('Error syncing user during sign in:', error);
        return true; // Continue with sign in even if sync fails
      }
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Prevent automatic redirects - let the component handle the flow
      console.log('Redirect callback - url:', url, 'baseUrl:', baseUrl);
      
      // Return the current page to prevent automatic redirect
      return `${baseUrl}/signin`;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
  },
};

export const GET = async (req: any, res: any) => {
  return NextAuth(req, res, authOptions);
};

export const POST = async (req: any, res: any) => {
  return NextAuth(req, res, authOptions);
};