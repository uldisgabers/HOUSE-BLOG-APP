import { Data } from "akar-icons";
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username..." },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
      
        async function getUser(slug: string) {
          const res = await fetch("http://localhost:3000/api/users/" + slug, {
            next: {
              revalidate: 0,
            },
          });
      
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
      
          const data = await res.json();
      
          return data;
        }
      
        try {
          const user = (await getUser(username))[0];
      
          if (user && user.password === password) {
            return { id: user.id, username: user.username, email: user.email, name: user.username };
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error: unknown) {
          throw new Error('Failed to authenticate user');
        }
      }
    })
  ] 
}

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}