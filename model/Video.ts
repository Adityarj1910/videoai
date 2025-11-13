import mongoose, {Schema,model,models} from "mongoose";

export const VIDEO_DIMESNIONS = {
    WIDTH: 1280,
    HEIGHT: 1920,
} as const; // expoerting as const to make it read-only

export interface IVideo{
    _id?: mongoose.Types.ObjectId; //? means optional
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?:{
        height: number;
        width: number;
        quality?: number;
    };
}


const videoSchema = new Schema<IVideo>(
    {
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        videoUrl:{
            type: String,
            required: true,
        },
        thumbnailUrl:{
            type: String,
            required: true,
        },
        controls:{
            type: Boolean,
            default: true,
        },
        transformation:{
            height:{type: Number, default:VIDEO_DIMESNIONS.HEIGHT},
            width:{type:Number, default: VIDEO_DIMESNIONS.WIDTH},
            quality: {type: Number, min:1, max:100},
        },
    },
    {
        timestamps:true
    }
);

//exporting and creating user model
const Video = models?.Video || model<IVideo>("Video",videoSchema);
export default Video;