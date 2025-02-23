'use client';
import { Button } from '@/components/ui/button';
import { FormEvent, useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import { Input } from './ui/input';
import { usePathname } from 'next/navigation';
import { InviteUsersToDocument } from '@/actions/actions';

export default function InviteUser() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState(''); // useState for email input
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const roomId = pathname.split('/').pop();
        if (!roomId) {
            toast.error('Room ID not found.');
            return;
        }

        startTransition(async () => {
            const { success } = await InviteUsersToDocument(roomId, email);

            if (success) {
                setIsOpen(false); // Close the dialog
                setEmail(''); // Clear input field
                toast.success('User added to the room successfully!');
            } else {
                toast.error('Failed to invite user to the room.');
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Invite</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a User to collaborate!</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to invite.
                    </DialogDescription>
                </DialogHeader>
                <form className="flex gap-2" onSubmit={handleInvite}>
                    <Input
                        type="email"
                        placeholder="Email"
                        className="w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update state
                        required
                    />
                    <Button type="submit" disabled={!email || isPending}>
                        {isPending ? 'Inviting...' : 'Invite'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
