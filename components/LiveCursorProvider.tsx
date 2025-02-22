'use client';

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import FollowPointer from "./FollowPointer";
import { PointerEvent } from "react";

export default function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handelPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    // update from ClientX and ClientY to pageX and pageY for full page cursor
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  }
  const handelPointerLeave = () => {
    updateMyPresence({ cursor: null });
  }
  return (
    <div
      onPointerMove={handelPointerMove}
      onPointerLeave={handelPointerLeave}
    >
      {/* Render cursors */}
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
        {children}
    </div>
  )
}
