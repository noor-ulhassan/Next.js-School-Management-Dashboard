import CountChart from '@/components/CountChart'
import UserCard from '@/components/UserCard'
import React from 'react'

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>

      {/*Left*/}
      <div className='w-full lg:w-2/3'>
        {/*User Card*/}
        <div className='flex justify-between gap-4'>
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/*MIDDLE Charts*/}
        <div className='flex gap-4 flex-col lg:flex-row mt-4'>
          {/*Count Chart*/}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          {/*Bottom chart*/}
          <div className='w-full lg:w-2/3 h-[450px]'>

          </div>
        </div>
      </div>
      {/*Right*/}
      <div className='w-full lg:w-1/3'></div>
    </div>
  )
}

export default AdminPage