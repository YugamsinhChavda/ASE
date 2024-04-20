import { User } from "@/models/user";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const Options = {
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                username: { label: "Email", type: "email", placeholder: "test@exmaple.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;
                mongoose.connect(process.env.MONGO_URL);
                const user = await User.findOne({ email });
                const comparePassword = user && bcrypt.compareSync(password, user.password);

                if (comparePassword) {
                    return user;
                }
                return null;
            }
        })
    ]
};

export async function isAdmin() {
    const session = await getServerSession(Options);
    const email = session?.user?.email;
    if(!email){
        return false;
    }
    const user = await User.findOne({email: email});
    if(!user){
        return false;
    }
    return user.admin;
}

const handler = NextAuth(Options);

export { handler as GET, handler as POST }