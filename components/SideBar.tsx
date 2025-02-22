'use client'
import NewDocumentButton from './NewDocumentButton'
import { useCollection } from "react-firebase-hooks/firestore"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { collectionGroup, doc, query, where } from 'firebase/firestore'
import { db } from '@/firbase'
import { useEffect, useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import SideBarOption from './SideBarOption'

// RoomDocument inhrites from the DocumentData
interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
}


function SideBar() {

    const { user } = useUser()
    const [groupedData, setGroupedData] = useState<{
        owner: RoomDocument[];
        editor: RoomDocument[];
    }>({
        owner: [],
        editor: []
    })

    // we use the useCollection to return multiple documents 
    const [data, loading, error] = useCollection(
        user &&
        query(
            collectionGroup(db, "rooms"),
            where("userId", "==", user.emailAddresses[0].toString())
        )
    );

    //  using the useEffect we want to fetch the data from firstore 
    // and structure them depending on the role , if the user is owner r the editor 
    useEffect(() => {
        if (!data) return;

        const groued = data.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>(
            (acc, curr) => {

                const roomData = curr.data() as RoomDocument;

                if (roomData.role === "owner") {
                    acc.owner.push({
                        id: curr.id,
                        ...roomData,
                    })
                } else {
                    acc.editor.push({
                        id: curr.id,
                        ...roomData,
                    })
                }
                return acc;
            }, {
            owner: [],
            editor: []
        }
        )
        setGroupedData(groued)
    }, [data])

    const menuOptions = (
        <>
            <NewDocumentButton />
            <div className="flex py-4 flex-col space-y-4 md:max-w-36">
                {/*My Documents */}
                {groupedData.owner.length === 0 ? (
                    <h2 className="text-gray-500 font-semibold text-sm ">
                        No documents found
                    </h2>
                ) : (
                    <>
                        <h2 className='text-gray-500 font-semibold text-sm'>
                            My Documents
                        </h2>
                        {groupedData.owner.map((doc) => (

                            <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}
            
            {/* List.. */}
            {/* Shared with me */}
            
            {groupedData.editor.length > 0 && (
                <>
                    <h2 className='text-gray-500 font-semibold text'>
                        Shared with Me
                    </h2>
                    {groupedData.editor.map((doc) => (

                        <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                    ))}
                </>
            )}
            </div>
            {/* List.. */}
        </>
    )
    return (
        <div className='p-2 md:p-5 bg-gray-200 relative'>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className='p-2 hover:opacity-30 rounded-lg' size={40} />
                    </SheetTrigger>
                    <SheetContent side={'left'}>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>{menuOptions}</div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:inline">

                {menuOptions}
            </div>
        </div>
    )
}

export default SideBar
