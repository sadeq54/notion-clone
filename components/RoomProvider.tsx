'use client';

import { ClientSideSuspense, RoomProvider as RoomProviderWrapper } from "@liveblocks/react/suspense"
import LoadingSpinner from "./ui/LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";
export default function RoomProvider({ children, roomId }:
  { children: React.ReactNode, roomId: string }) {
    
    return (
        <RoomProviderWrapper
            id={roomId}
            initialPresence={{
                cursor: null,
            }}>
                
            <ClientSideSuspense fallback={<LoadingSpinner />}>
              <LiveCursorProvider>
                
                {children}
              </LiveCursorProvider>
            </ClientSideSuspense>
        </RoomProviderWrapper>
    );
}
