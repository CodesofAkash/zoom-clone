import HomeCard from './HomeCard';
import { meetingTypes } from '@/constants';

const MeetingTypeList = () => {

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        {meetingTypes.map((data) => (
            <HomeCard key={data.meetingState} img={data.img} title={data.title} description={data.description} meetingState={data.meetingState} color={data.color} />
        ))}
    </section>
  )
}

export default MeetingTypeList
