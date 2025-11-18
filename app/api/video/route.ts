//create endpoint for video
import { authOptions } from "@/lib/auth";
import { connectToDatabse } from "@/lib/db";
// import { Video } from "@imagekit/next";
import Video, { IVideo, VIDEO_DIMESNIONS } from "@/model/Video";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//GET function to get all videos (for all users, logged-in or guest user)
export async function GET(){
    try {
        await connectToDatabse(); //connect to db

        //get all videos and sort by creation time.
        const Videos = await Video.find({}).sort({createdAt:-1}).lean(); //makes mongo query lighter and faster
        //normal mongo query is heavy as get/set or other function is loaded
        //but when we only need data and no need for updation -> we use lean.

        if(!Videos || Videos.length === 0){
            return NextResponse.json([],{status:200})
        }

        return NextResponse.json(Videos)
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch videos"},
            {status: 500}
        )
    }
}

//POST funciton to create new video record (only for logged in users)
export async function POST(request:NextRequest){
    try {
        //cehck for logged in user
        //getServerSession is out of the box from next
        //authOptions -> written in lib/auth.ts (authentication check already mentioned there)
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error: "Unauthorised"},
                {status: 401}
            )
        }

        await connectToDatabse()

        //read the data sent by the client and store in body
        const body: IVideo = await request.json() //all data from request -> use video interface
        //get the mandatory feild at least

        if(  //check for mandatory fields
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Missing Requiered Fields"},
                {status: 40}
            )
        }

        //all checking and validation done 
        //now prepare the video data

        const VideoData = { //imagekit will give these values after being uploaded
            ...body, //this contains the mandatory feilds
            controls : body?.controls??true, //controls -> optional else true
            transformation: { //optional feilds
                height: VIDEO_DIMESNIONS.HEIGHT, //already saved as const value in Video.ts model
                width: VIDEO_DIMESNIONS.WIDTH, 
                quality : body.transformation?.quality??100 //if we get quality fine else use 100 as default value.
            }
        }

        //saving video details (after uploading to imagekit) to mongoDB
        const newVideo = await Video.create(VideoData)
        //this validates using mongoose model in Video
        //inserts it into mongoDB database
        //returns the created document as newVideo

        return NextResponse.json(newVideo) //return the response as json indicating video created and details stored in database


    } catch (error) {
        return NextResponse.json(
            {error: "Failed to create video"},
            {status: 500}
        )

    }
}