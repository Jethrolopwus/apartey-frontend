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

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      const { user, account } = params;

      // Automatically sync user data with backend on sign in
      try {
        console.log("User signing in:", user);

        const userData = {
          googleId: user.id,
          email: user.email,
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          image: user.image,
          provider: account?.provider || "google",
          providerId: account?.providerAccountId || user.email,
          lastLogin: new Date().toISOString(),
        };

        // Get the base URL for the sync endpoint
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/users/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to sync user with backend:", errorText);
          throw Error("An error occurred. Please try again");
        } else {
          const result = await response.json();
          console.log("User synced successfully with backend:", result);

          return true;
        }
      } catch (error) {
        console.error("Error syncing user during sign in:", error);
        return true; // Continue with sign in even if sync fails
      }
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow the component to handle redirects after authentication
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);

      // For Google OAuth, let the component handle the redirect
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default to signin page
      return `${baseUrl}/signin`;
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
