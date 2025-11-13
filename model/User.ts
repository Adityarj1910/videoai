import mongoose, {Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId; //? means optional
    createdAt? : Date; // ? -> means optional
    updatedAt? : Date; 
}


const userScema = new Schema<IUser>(
    {
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving user

userScema.pre("save",async function(next)
{
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

//exporting and creating user model
const User = models?.User || model<IUser>("User",userScema);
export default User;