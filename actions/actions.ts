"use server";

import { adminDb } from "@/firbase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";



export async function createNewDocument() {
    // Ensure the user is authenticated
auth.protect();


console.log("createNewDocument")

const {sessionClaims} = await auth();
// the session claims are the props that we defined in session part in the clerk
// which are the first , last and full name , email and image 

const docCollectionRef = adminDb.collection("documents");

const docRef = await docCollectionRef.add({
    title:"New Doc"
})
// the document id is the email from the user ,

// !: non-null assertion tell the ts that sessionClaims is not null or undefined

 await adminDb
 .collection("users")
 .doc(sessionClaims?.email!)
 .collection("rooms")
 .doc(docRef.id)
 .set({
    userId:sessionClaims?.email!,
    role:"owner",
    createdAt:new Date(),
    roomId:docRef.id
 })

 


return {docId: docRef.id}

}


export async function deleteDocument(roomId:string) {
  auth.protect()

  try {
    // remmber we have the document in tow colleections
    // the first in the in the document collection 
    // and the secound in the user collection where inside the room there are 
    // multiple docs id that every one  hold the doc data like email , roe and so on 


    // delete the room itself
    await adminDb.collection("documents").doc(roomId).delete()

    // gain all the  the documents inside room 
    const query = await adminDb
    .collectionGroup("rooms")
    .where("roomId" , "==" , roomId)
    .get();

    console.log(query)  // see it ..
    // use when u wanna delete somethingwhile u looping 
    const batch = adminDb.batch()

    query.docs.forEach((doc)=> {
        console.log(doc)
        batch.delete(doc.ref)
    })
    batch.commit()


    // delete the room from the liveblock 
    // u can check the website and make sure that doc is 
    await liveblocks.deleteRoom(roomId)


    return {success : true}

  } catch (error) {
    console.log(error)
    return {success : false}
  }
}

export async function InviteUsersToDocument(roomId:string , email: string | null) {
    // protect the route
    auth.protect()
    if (!email) return {success:false}


    try {
        
      
        // add the user to the room 
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .set({
            userId:email,
            role:"editor",
            createdAt:new Date(),
            roomId
        })

        return {success:true}

    } catch (error) {
        console.log(error)
        return {success:false}
    }

}

export async function removeUserFromDocument(roomId:string , email: string | null) {
    // protect the route
    auth.protect()
    if (!email) return {success:false}


    try {
        
      
        // add the user to the room 
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .delete()

        return {success:true}

    } catch (error) {
        console.log(error)
        return {success:false}
    }

}

