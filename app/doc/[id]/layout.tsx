import RoomProvider from '@/components/RoomProvider';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

export default function DocLayout({children ,params}
  : {children: React.ReactNode , params: {id: string}}) {

    const unwrappedParams = React.use(params);
      const { id } = unwrappedParams; 
    auth.protect();

  return (
    <RoomProvider
    roomId={id}
    >
        {children}
    </RoomProvider>
  );
}

// children here is the page.tsx

