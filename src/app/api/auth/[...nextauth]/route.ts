import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import { PrismaClient } from "../../../../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'email@example.com'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                if (!user) {
                    return null
                }
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if (!isPasswordValid) {
                    return null
                }
                return {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.id = user.id
                token.username = user.username
            }
            return token
        },

        async session({session, token}) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.username = token.username as string
            }
            return session
        }
    }
}
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}