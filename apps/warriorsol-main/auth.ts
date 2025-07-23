import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";

// 🔥 Extend types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
    loginMethod: string;
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
    loginMethod: string;
  }
}

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        const { email, password, token } = credentials as {
          email?: string;
          password?: string;
          token?: string;
        };

        if (token) {
          // 🪄 SSO flow
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/validate-token`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error("Invalid or expired SSO token");

          const json = await res.json();
          const userData = json.data;

          const [firstName, ...lastParts] = userData.name?.split(" ") || [];
          const lastName = lastParts.join(" ");

          return {
            id: userData.id,
            email: userData.email,
            firstName,
            lastName,
            role: userData.role || "user",
            token: token,
            loginMethod: "sso",
          };
        }

        // 💻 Normal login flow
        const form = new URLSearchParams();
        form.append("email", email!);
        form.append("password", password!);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: form.toString(),
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Login failed");

        const userData = json.data;
        const [firstName, ...lastParts] = userData.name?.split(" ") || [];
        const lastName = lastParts.join(" ");

        return {
          id: userData.id,
          email: userData.email,
          firstName,
          lastName,
          role: userData.role || "user",
          token: userData.token,
          loginMethod: "credentials",
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
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

          const json = await res.json();
          if (!res.ok || !json.data?.token)
            throw new Error("GOOGLE_LOGIN_BLOCKED");

          const { token, id, name, role } = json.data;
          user.id = id;
          user.name = name;
          user.token = token;
          user.role = role;
          user.loginMethod = "google";

          return true;
        } catch (err) {
          console.error("❌ Google sync failed:", err);
          throw new Error("GOOGLE_LOGIN_BLOCKED");
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.email = user.email;
        token.firstName =
          user.firstName || (user.name?.split(" ")[0] as string);
        token.lastName =
          user.lastName || (user.name?.split(" ").slice(1).join(" ") as string);
        token.accessToken = user.token;
        token.role = user.role || "user";
        token.loginMethod = user.loginMethod || account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        token: token.accessToken,
        role: token.role || "user",
        loginMethod: token.loginMethod,
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hrs
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
