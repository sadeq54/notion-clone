'use client';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { deleteDocument } from '@/actions/actions';
import { toast } from 'sonner';

export default function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransaction] = useTransition();
    const router = useRouter();

    // Using the pathname to get the ID of the room
    const pathname = usePathname();

    const handleDelete = async () => {
        const roomId = pathname.split('/').pop();
        if (!roomId) return;
        startTransaction(async () => {
            const { success } = await deleteDocument(roomId);

            if (success) {
                setIsOpen(false);
                router.replace('/');
                toast.success('Room deleted successfully!');
            } else {
                toast.error('Failed to delete room!');
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Remove the Button wrapper and style DialogTrigger directly */}
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to Delete?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your document and all its content, removing all the users from the document.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}