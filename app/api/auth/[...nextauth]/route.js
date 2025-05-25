// app/api/auth/[...nextauth]/route.js OR route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`,
          image: user.image || null
        };
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      await connectToDB();
      const userSession = await User.findOne({ email: session.user.email });
      if (userSession) {
        session.user.id = userSession._id.toString();
        session.user.name = `${userSession.firstName || ""} ${userSession.lastName || ""}`;
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          await new User({
            email: profile.email,
            image: profile.picture,
            firstName: profile.given_name || "Dev",
            lastName: profile.family_name || "User",
            password: "oauth",
            joined: new Date()
          }).save();
        }
        return true;
      } catch (e) {
        console.log("Sign In Error:", e);
        return false;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
