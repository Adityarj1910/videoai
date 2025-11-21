"use client"
// import { error } from "console";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import User from "@/model/User";
function RegisterPage(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const router = useRouter(); //to route the user to login page once registered.

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Password does not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/register",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await res.json(); //(use json() instead of json() to avoid type error)

            
            if(!res.ok){
                throw new Error(data.error || "Registration Failed");
            }
            console.log(data);
            router.push("/login");
        } catch (err) {
            alert(err);
            console.log(err);
        }
    };
    return (<div> 
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <br />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
            />
            <br />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
            />
            <br />
            <button type="submit">Register</button>
        </form>
        <div>
        <p>
            Already have an account? <a href="/login">Login</a>
        </p>
        </div>
    </div>
    );
};



export default RegisterPage;