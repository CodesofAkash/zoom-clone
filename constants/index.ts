export const sidebarLinks = [
    {
    label: 'Home',
    route: '/',
    imgUrl: '/icons/Home.svg',
    },
    {
    label: 'Upcoming',
    route: '/upcoming',
    imgUrl: '/icons/upcoming.svg',
    },
    {
    label: 'Previous',
    route: '/previous',
    imgUrl: '/icons/previous.svg',
    },
    {
    label: 'Recordings',
    route: '/recordings',
    imgUrl: '/icons/Video.svg',
    },
    {
    label: 'Personal Room',
    route: '/personal-room',
    imgUrl: '/icons/add-personal.svg',
    }
];

export const meetingTypes = [
    {
        img: "/icons/add-meeting.svg",
        title: "New Meeting",
        description: "Start an instant meeting",
        meetingState: "isInstantMeeting",
        color: "bg-orange-1"
    },
    {
        img: "/icons/join-meeting.svg",
        title: "Join Meeting",
        description: "via invitation link",
        meetingState: "isJoiningMeeting",
        color: "bg-blue-1"
    },
    {
        img: "/icons/schedule.svg",
        title: "Schedule Meeting",
        description: "Plan your meeting",
        meetingState: "isScheduleMeeting",
        color: "bg-purple-1"
    },
    {
        img: "/icons/recordings.svg",
        title: "View Recordings",
        description: "Check out your recordings",
        meetingState: "goingToRecordings",
        color: "bg-yellow-1"
    },
] as const;

export const avatarImages = [
    '/images/avatar-1.jpeg',
    '/images/avatar-2.jpeg',
    '/images/avatar-3.png',
    '/images/avatar-4.png',
    '/images/avatar-5.png',
]