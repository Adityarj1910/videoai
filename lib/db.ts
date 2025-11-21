import mongoose from "mongoose";
import { cache } from "react";
// import "types.d.ts";

const MONGODBURI = (process.env.MONGODB_URI!);
// (!) to heck if the MONGODB_URI is defined in the environment variables

// Throw an error if MONGODB_URI is not defined
if (!MONGODBURI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}

let cached = (global as any).mongoose;

if(!cached){
    (global as any).mongoose = {conn: null, promise: null}
    cached = (global as any).mongoose;
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        // cached.promise = mongoose
        // .connect(MONGODB_URI)
        // .then(()=> mongoose.connection)
        // cached.promise = mongoose.
        // connect(process.env.MONGODB_URI!)
        // .then(() => mongoose.connection);
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };
      
        cached.promise = mongoose
        .connect(MONGODBURI, opts)
        .then(() => mongoose.connection);
    }
      
    
    try{
        cached.conn = await cached.promise;
    }catch(error){
        cached.promise=null;
        throw error;
    }

    return cached.conn
}
//all this circus just to handle the edge network of nextjs.
//also we have written precautionary code keeping in mind about ts.
// however this databse connection could have been like
// mongoose.connect(MONGODB_URI);
// export const db = mongoose.connection; 