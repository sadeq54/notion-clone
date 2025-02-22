'use client';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import {  removeUserFromDocument } from '@/actions/actions';
import { useUser } from '@clerk/nextjs';
import useOwner from '@/lib/useOwner';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collectionGroup, query, where } from 'firebase/firestore';
import { db } from '@/firbase';
import { useRoom } from '@liveblocks/react/suspense';
export default function ManageUser() {
    const [isOpen, setIsOpen] = useState(false);

    // to know the current user 
    const { user } = useUser();


    const isOwner = useOwner()

    const [isPending, startTransition] = useTransition();

    const room = useRoom()
    const [UsersInRoom] = useCollection(
        user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
    )

    const handleDelete = async (userId: string) => {
        if (!userId) return;

                startTransition(async () => {
                    const { success } = await removeUserFromDocument(room.id , userId);
        
                    if (success) {
                        setIsOpen(false);
                       
                        toast.success('user removed from the room successfully!');
                    } else {
                        toast.error('Failed to remove the user from  room!');
                    }
                });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Users ({UsersInRoom?.docs.length})</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Users with Access</DialogTitle>
                    <DialogDescription>
                        Bellow is a list of users who have access to this document.
                    </DialogDescription>
                </DialogHeader>
                <hr className='my-2' />
                <div className="flex flex-col space-y-2">
                    {/* UsersInRoom */}
                    {UsersInRoom?.docs.map((doc) => (
                        <div
                            key={doc.data().userId}
                            className='flex items-center justify-between'
                        >
                            <p className="font-light">
                                {doc.data().userId === user?.emailAddresses[0].toString() ?
                                    `You (${doc.data().userId})` :
                                    doc.data().userId}
                            </p>
                            <div className='flex items-center gap-2'>
                                <Button variant="outline">{doc.data().role}</Button>
                                {isOwner &&
                                    doc.data().userId !== user?.emailAddresses[0].toString() &&

                                    <Button
                                        variant={"destructive"}
                                        onClick={() => handleDelete(doc.data().userId)}
                                        disabled={isPending}
                                        size={"sm"}
                                    >
                                        {isPending ? "Pending.." : "X"}
                                    </Button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}