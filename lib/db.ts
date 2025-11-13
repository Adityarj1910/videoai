import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI! 
// (!) to heck if the MONGODB_URI is defined in the environment variables

// Throw an error if MONGODB_URI is not defined
if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}

let cached = global.mongoose;

if(!cached){
   cached  = global.mongoose = {conn: null, promise: null}
}

export async function connectToDatabse(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        mongoose
        .connect(MONGODB_URI)
        .then(()=> mongoose.connection)
    }
    try{
        cached.conn = await cached.promise;
    }catch(error){
        cached.promise=null;
    }

    return cached.conn
}
//all this circus just to handle the edge network of nextjs.
//also we have written precautionary code keeping in mind about ts.
// however this databse connection could have been like
// mongoose.connect(MONGODB_URI);
// export const db = mongoose.connection; 