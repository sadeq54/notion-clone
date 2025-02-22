import { adminDb } from "@/firbase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    auth.protect()

    const {sessionClaims} = await auth()
    const {room} = await req.json()


    const session = liveblocks.prepareSession(sessionClaims?.email!,{
        userInfo:{
            name:sessionClaims?.fullName!,
            email:sessionClaims?.email!,
            avatar:sessionClaims?.image!,
        },
         
    } )
    
    // gain all te users in the room 
    const usersInRoom= await adminDb
    .collectionGroup("rooms")
    .where("userId", "==",sessionClaims?.email)
    .get()



    const userInRoom = usersInRoom.docs.find((doc)=> doc.id === room )
    if (userInRoom?.exists){
        session.allow(room, session.FULL_ACCESS);
        const {body , status} = await session.authorize()
        return new Response(body, {status})
    }else {
        return NextResponse.json(
            {message:"you are not in this room"},
            {status:403}
        )
    }
}


// this rout (auth-endpoint) used to check if the user is allowed to enter the room 
// this rout (auth-endpoint) in the LiveBlocksProvider where fisrt thing first 
// check if the user in the room  