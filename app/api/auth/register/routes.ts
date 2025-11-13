import { connectToDatabse } from "@/lib/db";
import User from "@/model/User";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {  
    try{

        // get value from db and validate email and pwd
        const {email, password} = await request.json()
        if(!email || !password ){
            return NextResponse.json(
                {error: "Email and Password are required"},
                {status: 400}
            )
        }
        //check weather connected to db or not.
        await connectToDatabse() 
        
        //check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        //if user not present -> create user
        await User.create({ 
            email,
            password
        })
        return NextResponse.json(
            {message: "User registered sucessfullty"},
            {status: 400}
        );

    }catch(error){
        console.error("Registration error", error)
        return NextResponse.json(
            {error : "Failed to register user"},
            {status: 400}
        )
    }
}