import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
  // debug: true,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (user && (await compare(credentials.password, user.password))) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: user.avatar,
            };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  // adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is correctly set
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
});
