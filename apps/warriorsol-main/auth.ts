import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInSchema } from "@/lib/utils";
import type { AuthOptions, User } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
  }
  interface Session {
    user: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    accessToken: string;
  }
}

class InvalidLoginError extends Error {
  code = "custom";
  redirectUrl?: string;

  constructor(message: string, redirectUrl?: string) {
    super(message);
    this.code = message;
    this.redirectUrl = redirectUrl;
  }
}

const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);
          const formData = new URLSearchParams();
          formData.append("email", email);
          if (password) formData.append("password", password);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: formData,
            }
          );

          const data = await response.json();

          if (!response.ok) {
            const redirectUrl = data.data?.redirectUrl;
            const errorMessage = redirectUrl
              ? `${data.message}|REDIRECT:${redirectUrl}`
              : data.message;
            throw new InvalidLoginError(errorMessage);
          }

          const userData = data.data;
          const [firstName, ...lastParts] = userData.name?.split(" ") || [];
          const lastName = lastParts.join(" ");

          return {
            id: userData.id,
            email: userData.email,
            firstName,
            lastName,
            role: userData.role || "user",
            token: userData.token,
          };
        } catch (error) {
          if (error instanceof InvalidLoginError) throw error;
          throw new InvalidLoginError((error as { message: string }).message);
        }
      },
    }),
  ],

  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-sync`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data.data?.token) {
            // 👇 BLOCK and REDIRECT with error query param
            throw new Error("GOOGLE_LOGIN_BLOCKED");
          }

          // ✅ Inject token and user data
          account.access_token = data.data.token;
          user.id = data.data.id;
          user.name = data.data.name;
          user.token = data.data.token;
          user.role = data.data.role || "user";

          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("❌ Google sync failed:", message);
          // 👇 Prevent login if sync fails
          throw new Error("GOOGLE_LOGIN_BLOCKED");
        }
      }

      return true;
    },

    jwt: async ({ token, user, account }) => {
      if (user && account) {
        if (account.provider === "google") {
          token.id = user.id;
          token.email = user.email!;
          token.firstName = user.name?.split(" ")[0] || "";
          token.lastName = user.name?.split(" ").slice(1).join(" ") || "";

          // ✅ Use the backend token injected into account
          token.accessToken = account.access_token!;
        } else {
          token.id = (user as User).id;
          token.email = (user as User).email;
          token.firstName = (user as User).firstName;
          token.lastName = (user as User).lastName;
          token.accessToken = (user as User).token;
          token.role = (user as User).role || "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        token: token.accessToken as string,
        role: (token.role as string) || "user",
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export { authConfig };
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
