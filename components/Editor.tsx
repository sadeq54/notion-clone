'use client'

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import TranslateDocument from "./TranslateDocument";

type EditorProps = {
    doc: Y.Doc;
    provider: any;
    darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: EditorProps) {
    const userInfo = useSelf((me) => me.info);
    
    // Initialize the BlockNote editor with collaboration
    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: userInfo?.name || 'Anonymous',
                color: stringToColor(userInfo?.email || '1')
            }
        }
    });

    return (
        <div className="relative max-w-6xl mx-auto">
            {/* Render the BlockNote editor with all content */}
            <BlockNoteView
                className="min-h-screen"
                editor={editor}
                theme={darkMode ? "dark" : "light"}
            />
        </div>
    );
}   

function Editor() {
    const room = useRoom();
    const [doc, setDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<LiveblocksYjsProvider>();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Initialize Yjs document and Liveblocks provider
        const ydoc = new Y.Doc();
        const yProvider = new LiveblocksYjsProvider(room, ydoc);

        setDoc(ydoc);
        setProvider(yProvider);

        return () => {
            // Cleanup on unmount
            ydoc.destroy();
            yProvider?.destroy();
        };
    }, [room]);

    if (!doc || !provider) {
        return null; // Render nothing until doc and provider are ready
    }

    const style = `hover:text-white ${
        darkMode ?
            "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700" :
            "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
    }`;

    return (
        <div className='max-w-6xl mx-auto'>
            <div className="flex items-center gap-2 justify-end mb-10">
                {/* TranslateDocument AI */}
                    <TranslateDocument doc={doc} />
            {/* chateToDocument AI */}
                {/* Dark Mode Toggle Button */}
                <Button
                    className={style}
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
            </div>
            {/* Render the BlockNote editor with all content */}
            <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
        </div>
    );
}

export default Editor;