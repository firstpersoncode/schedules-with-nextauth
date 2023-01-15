import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import db from "prisma/db";
import { getUser } from "prisma/users";

export default NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      type: "credentials",
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await getUser({ email });
        if (!user) throw new Error("User not found");
        if (!user.emailVerified)
          throw new Error(
            "User's email address is not verified yet, check your inbox to finish up verification"
          );
        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        delete user.password;
        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified;
      }

      return true;
    },
  },
});
