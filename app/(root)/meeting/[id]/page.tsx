"use client";

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Meeting = ({params}: {params: Promise<{id: string}>}) => {

  const resolvedParams = React.use(params);

  const {isLoaded} = useUser();
  const { call, isCallLoading } = useGetCallById(resolvedParams.id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);


  if(!isLoaded || isCallLoading) return <Loader />


  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
