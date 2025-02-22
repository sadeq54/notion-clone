"use client"
import React, { FormEvent, useEffect, useState, useTransition } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firbase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Editor from './Editor'
import useOwner from '@/lib/useOwner'
import DeleteDocument from './DeleteDocument'
import InviteUser from './InviteUser'
import ManageUser from './ManageUser'
import Avatars from './Avatars'


function Document({id}:{id:string}) {
    // here how we can access the data 
    const [data, loading , error] = useDocumentData(doc(db, "documents", id ));
    const [input, setInput] = useState("")
    const [isUpdating , startTransaction] =  useTransition()
    const isOwner = useOwner()
    

    // when the title git updated the state will change 
    useEffect(()=>{
        if (data){
            setInput(data.title)
        }
    }, [data])

   const onUpdate = (e: FormEvent)=>{
            e.preventDefault()
            if (input.trim()){
                startTransaction(async ()=>{
                    await updateDoc(doc(db,"documents", id), {
                        title:input
                    })
                })
            }
   }
   console.log(isOwner)
  return (
    <div className='flex-1 h-full bg-white p-5'>
    <div className='flex justify-center max-w-6xl mx-auto pb-5'>
      <form onSubmit={onUpdate} className='flex max-w-screen-md flex-1 space-x-2'>
        {/* update title... */}
        <Input onChange={(e)=> setInput(e.target.value)} value={input}/>

        <Button disabled={isUpdating} type='submit'>
         {isUpdating ? "updating...": "update"}    
         </Button>
        
        {/* isOwner && InviteUser , DeleteDocument */}
        {isOwner &&
         (
          <>
          {/* InviteUser */}
          <InviteUser/>
          {/* DeleteDocument */}
          <DeleteDocument/>
          </>
        )}
      </form>
    </div>
      <div>
        <div className="flex max-w-6xl mx-auto justify-between items-center mb-5 " >
        {/* ManageUser */}
        <ManageUser/>

        {/* Avatars */}
        <Avatars />
      </div>
        <hr className="pb-10" />
        <Editor/>
      {/* Collaborative Editor */}
      </div>
    </div>
  )
}




export default Document
