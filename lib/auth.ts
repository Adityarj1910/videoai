
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { connectToDatabase } from "./db";
import User from "@/model/User";


export const authOptions: NextAuthOptions = {
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
        CredentialsProvider({ //nextauth does not give logic for credentials
            //we need to write logic ourself 
            name: "Credentials",
            credentials: {
                //2 cred -> email and pass (that is passed fro FE)
                email: {label: "Email", type: "text"},
                password: {label: "Password", type:"password"}
            },
            async authorize(credentials){ //check
                //for missing email or pass
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Email or Password") 
                }

                // we have pass and valid email
                try{
                    await connectToDatabase() //connect to db
                    //get the user mathcing to the email 
                    const user = await User.findOne({email: credentials.email})
                // check if user exist
                    if(!user){
                        throw new Error("No user found")
                    }

                //check and compare the password (bcrypt as passsword is stored as such)
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isValid) {
                        throw new Error("Invalid Password")
                    }
                
                //email and password -> checked ->return the user (data)
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    console.error("Auth Error")
                    throw error
                }
            }
        })
  ],
  // now we need to write callback logic
  //Callbacks are asynchronous functions you can use to control what happens when an action is performed.

  //callbacks include -> signIn, redirect, session, jwt etc
  callbacks: {
    async jwt({token, user}){
        if(user){
            token.id = user.id
        }
        return token
    },
    async session({session,token}){
        if(session.user){
            session.user.id = token.id as string 
        }
        return session;
    }
  },

  pages: {
    signIn: "/login",
    error: "/login"
  },
  session:{
    strategy: "jwt",
    maxAge: 30*24*60*60,
  },
  secret: process.env.NEXTAUTH_SECRET
};
