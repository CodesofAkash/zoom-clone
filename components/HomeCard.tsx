"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';

interface HomeCardProps {
    img: string;
    title: string;
    description: string;
    meetingState: 'isInstantMeeting' | 'isJoiningMeeting' | 'isScheduleMeeting' | 'goingToRecordings';
    color: string;
}

const HomeCard = ({color, description, img, meetingState: thisMeetingState, title}: HomeCardProps) => {

    const router = useRouter();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [isPending, setIsPending] = useState(false); 
    
    const [meetingState, setMeetingState] = useState<'isInstantMeeting' | 'isJoiningMeeting' | 'isScheduleMeeting' | 'goingToRecordings' | undefined>();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    });
    const [callDetails, setCallDetails] = useState<Call>()

    useEffect(() => {
        if(meetingState === 'goingToRecordings') {
            router.push('/recordings');
        }
    }, [meetingState, router]);

    const createMeeting = async () => {
        if(!user || !client) return;

        try {
            if(!values.dateTime) {
                toast.error('Please select a date and time for the meeting.');
                return;
            }

            setIsPending(true);
            const id = crypto.randomUUID();
            
            const call = client.call('default', id);

            if(!call) throw new Error('Failed to create call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    }
                }
            })

            setCallDetails(call);

            if(!values.description) {
                router.push(`/meeting/${call.id}`);
            }

            toast.success('Meeting created successfully!');

        } catch {
            toast.error('Failed to create meeting. Please try again later.');
        } finally {
            setIsPending(false);
        }
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section>
        <div
            className={`${color} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}
            onClick={() => setMeetingState(thisMeetingState)}
        >
            <div className='flex-center glassmorphism size-12 rounded-[10px]'>
                <Image
                    src={img}
                    alt={thisMeetingState}
                    height={27}
                    width={27}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>{title}</h1>
                <p className='text-lg font-normal'>{description}</p>
            </div>
        </div>

        {!callDetails ? (
            <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Create Meeting"
                handleClick={createMeeting}
                isPending={isPending}
            >
                <div className='flex flex-col gap-5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>
                        Add a description
                    </label>
                    <Textarea
                        className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                        onChange={(e) => {
                            setValues({...values, description: e.target.value});
                        }}
                    />
                </div>
                <div className="flex w-full flex-col gap-2.5">
                    <label className='text-base text-normal leading-[22px] text-sky-2'>
                        Select Date and Time
                    </label>
                    <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date) => {
                            setValues({...values, dateTime: date!})
                        }}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        timeCaption='time'
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                    />
                </div>
            </MeetingModal>
        ) : (
            <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Meeting Created"
                className="text-center"
                handleClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast.success('Link Copied');
                    setMeetingState(undefined);
                }}
                image={"/icons/checked.svg"}
                buttonIcon={"/icons/copy.svg"}
                buttonText="Copy Meeting Link"
                isPending={isPending}
            />
        )}

        <MeetingModal
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Start an Instant Meeting"
            className="text-center"
            buttonText="Start Meeting"
            handleClick={createMeeting}
            isPending={isPending}
        />

        <MeetingModal
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Type the link here"
            className="text-center"
            buttonText="Join Meeting"
            handleClick={() => router.push(`${values.link}`)}
            isPending={isPending}
        >
            <Input
                placeholder='Meeting Link'
                className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => setValues({...values, link: e.target.value})}
            />
        </MeetingModal>
    </section>
  )
}

export default HomeCard
