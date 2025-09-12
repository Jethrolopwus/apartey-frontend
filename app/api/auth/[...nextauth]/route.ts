import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Account, User, Session, Profile } from "next-auth";

// Define extended session type
interface ExtendedSession extends Session {
  accessToken?: string;
  provider?: string;
  providerId?: string;
  user: {
    id?: string;
    googleId?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Define extended JWT type
interface ExtendedJWT extends JWT {
  accessToken?: string;
  provider?: string;
  providerId?: string;
  id?: string;
  googleId?: string;
}

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID environment variable is required");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET environment variable is required");
}

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      checks: ["state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
  ],
  callbacks: {
    async jwt(params: {
      token: JWT;
      user?: User;
      account?: Account | null;
      profile?: Profile;
      trigger?: string;
      isNewUser?: boolean;
      session?: Session;
    }) {
      const { token, account, user } = params;
      const extendedToken = token as ExtendedJWT;

      // Add access token and user id to JWT
      if (account) {
        extendedToken.accessToken = account.access_token;
        extendedToken.provider = account.provider;
        extendedToken.providerId = account.providerAccountId;
      }
      if (user) {
        extendedToken.id = user.id;
        extendedToken.googleId = user.id;
      }
      return extendedToken;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedJWT;

      // Add access token and user id to session
      extendedSession.accessToken = extendedToken.accessToken;
      extendedSession.provider = extendedToken.provider;
      extendedSession.providerId = extendedToken.providerId;

      if (extendedSession.user) {
        extendedSession.user.id = extendedToken.id;
        extendedSession.user.googleId = extendedToken.googleId;
      }
      return extendedSession;
    },
    async signIn(params: {
      user: User;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      const { account } = params;

      // Always allow sign in for Google OAuth
      // The backend sync will be handled by the GoogleAuthButton component
      // For Google OAuth, always return true to allow sign in
      if (account?.provider === "google") {
        return true;
      }

      // For other providers, you can add additional logic here
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // If the URL contains /onboarding, redirect there directly
      if (url.includes('/onboarding')) {
        return `${baseUrl}/onboarding`;
      }

      // Always redirect to base URL to let the component handle the redirect
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
