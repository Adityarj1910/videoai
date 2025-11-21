"use client"
import React, {useState} from "react"
import { useRouter } from "next/navigation";
import { ReactFormState } from "react-dom/client";
import { signIn } from "next-auth/react";
// import { error } from "console";

export default function LoginPage(){

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const result = await signIn("credentials",{
            email,
            password,
            redirect: false,
        })

        if(result?.error){
            console.log(result.error);
        }else{
            router.push("/")
        }
    };

    return (<div 
    // style="display: flex; align-items: center; height: 200px;"
    > 
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>

            <div>
                {/* <button onClick={()=>signIn("google")}>SignIn with Google</button> */}
                Dont have an account?   
                
                <button onClick={()=> router.push("/register")}> Register </button>
            </div>
        </div>
    );
};
