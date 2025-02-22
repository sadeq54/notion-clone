'use client'
import * as Y from "yjs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { BotIcon, LanguagesIcon, CopyIcon , SquareIcon } from "lucide-react"; // Import icons
import { toast } from "sonner";
import Markdown from "react-markdown";

type Language = 'english'
    | 'spanish'
    | 'german'
    | 'french'
    | "chinese"
    | "japanese"
    | "hindi"
    | "russian"
    | "arabic"
    | "portuguese";

const languages: Language[] =
    ["english", "spanish", "german", "french", "chinese", "japanese", "hindi", "russian", "arabic", "portuguese"];


export default function TranslateDocument({ doc }: { doc: Y.Doc }) {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [summary, setSummary] = useState<string>("");
    const [question, setQuestion] = useState<string>("");

    // Function to handle copying the summary text
    const handleCopySummary = () => {
        navigator.clipboard.writeText(summary)
            .then(() => {
                toast.success("Copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy text.");
            });
    };

    function handleAskQuestion(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const documnetData = doc.get("document-store").toJSON();

            const response = await fetch(`${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documnetData,
                    targetLang: language
                }),
            });

            if (response.ok) {
                const { translated_text } = await response.json();
                setSummary(translated_text);
                toast.success("Translation successful!");
            } else {
                toast.error("Translation failed!");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LanguagesIcon />
                    Translate
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the document</DialogTitle>
                    <DialogDescription>
                        Select a language and AI will translate a summary of the document in the selected language.
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
                    <Select
                        value={language}
                        onValueChange={(value) => { setLanguage(value) }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={!language || isPending}>
                        {isPending ? 'Translating...' : 'translate'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}