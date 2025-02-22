"use client"

import { db } from "@/firbase";
import { doc } from "firebase/firestore";
import  Link  from "next/link";
import { usePathname } from "next/navigation";
import {  useDocumentData } from "react-firebase-hooks/firestore";

function SideBarOption({href, id}:{ 
    href:string;
    id:string;
}) {
    // we use the useDocumentData t return the single document
    const [data , loading , error ] = useDocumentData(doc(db, "documents", id))
    // use to return the current end point in the current path
    const pathName = usePathname();

    const isActive = href.includes(pathName) && pathName !== "/";

    if (!data) return null;


  return (
    
        <Link href={href} 
        className={`border p-2 rounded-md ${
            isActive?"bg-gray-300 font-bold border-black" : "border-gray-400"}`}> 

         <p className="truncate">{data.title}</p>
         
         
        </Link>
    
  )
}

export default SideBarOption
