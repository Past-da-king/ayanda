import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/UserModel';
import { AuthenticatedUser } from '@/types'; // Import AuthenticatedUser
// import { v4 as uuidv4 } from 'uuid'; // Not used

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }
        await dbConnect();
        const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        } as AuthenticatedUser; // Cast to AuthenticatedUser
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthenticatedUser; // Type assertion
        token.id = authUser.id;
        token.email = authUser.email;
        token.name = authUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const sessionUser = session.user as AuthenticatedUser; // Type assertion
        sessionUser.id = token.id as string;
        sessionUser.email = token.email as string;
        sessionUser.name = token.name as string | undefined | null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Optional: custom error page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

