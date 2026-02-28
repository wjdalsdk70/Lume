import { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? '',
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, profile }) {
      if (profile && typeof profile === 'object' && 'login' in profile) {
        token.username = String(profile.login);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.username = typeof token.username === 'string' ? token.username : undefined;
      }
      return session;
    },
  },
};
