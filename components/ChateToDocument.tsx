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
import * as Y from "yjs"
import { toast } from 'sonner';
import { Input } from './ui/input';
import { BotIcon, MessageCircleCode, SquareIcon } from 'lucide-react';
import Markdown from "react-markdown";

export default function ChateToDocument( {doc}:{doc:Y.Doc}) {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState<string>(""); // State for the question input
    const [isPending, startTransition] = useTransition();
    const [summary, setSummary] = useState<string>("");

    const handleCopySummary = () => {
        navigator.clipboard.writeText(summary)
            .then(() => {
                toast.success("Copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy text.");
            });
    };

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();
            console.log(documentData);
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/chatToDocument`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentData,
                    question 
                }),
            });

            if (response.ok) {
                const chatResponse = await response.json();
                console.log(chatResponse);
                setSummary(chatResponse?.response);
                toast.success("Answer sent successfully!");
            } else {
                toast.error("failed to send answer!");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <MessageCircleCode className='mr-2' />
                    Chat to Document
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chat to the Document!</DialogTitle>
                    <DialogDescription>
                        Ask a question and chat to the document with AI.
                    </DialogDescription>
                    <hr className="mt-5" />
                    {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
                </DialogHeader>
                {summary &&
                    <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                        <div className="flex">
                            <BotIcon className="w-10" />
                            <p className="font-bold">
                                GPT {isPending ? "is thinking..." : "Says:"}
                            </p>
                        </div>
                        <div className="flex items-start gap-2 w-full">
                            <div className="flex-1">
                                {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
                            </div>
                            {/* Copy Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopySummary}
                                className="w-8 h-8 p-1 rounded-lg hover:bg-gray-200"
                            >
                                <SquareIcon className="w-4 h-4" /> {/* Use SquareIcon or CopyIcon */}
                            </Button>
                        </div>
                    </div>
                }
                <form className="flex gap-2" onSubmit={handleAskQuestion}>
                    <Input
                        type="text" // Changed from 'email' to 'text'
                        placeholder="Ask a question..."
                        className="w-full"
                        value={question} // Bind the input value to the state
                        onChange={(e) => setQuestion(e.target.value)} // Update the state on change
                        required // Ensure the input is required
                    />
                    <Button type="submit" disabled={!question || isPending}>
                        {isPending ? 'Asking...' : 'Ask'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}