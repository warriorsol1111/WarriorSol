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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-sync`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                provider: "google",
              }),
            }
          );
        } catch (err) {
          console.error("❌ Failed to sync Google user to backend:", err);
          return false; // Block login if sync fails
        }
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user && account) {
        if (account.provider === "google") {
          token.id = user.id;
          token.email = user.email!;
          token.firstName = user.name?.split(" ")[0] || "";
          token.lastName = user.name?.split(" ").slice(1).join(" ") || "";
          token.accessToken = account.access_token!;
        } else {
          token.id = (user as User).id;
          token.email = (user as User).email;
          token.firstName = (user as User).firstName;
          token.lastName = (user as User).lastName;
          token.accessToken = (user as User).token;
        }
      }

      if (trigger === "update" && session) {
        const s = session as unknown as import("next-auth").Session["user"];
        if (s.firstName !== undefined) token.firstName = s.firstName;
        if (s.lastName !== undefined) token.lastName = s.lastName;
        if (s.email !== undefined) token.email = s.email;
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
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export { authConfig };
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
