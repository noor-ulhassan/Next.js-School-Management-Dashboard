import Image from 'next/image'
import React from 'react'

const Navbar = () => (
    <div className='flex items-center justify-between p-4'>
        {/*Search Bar*/}
        <div className='hidden md:flex rounded-full gap-2 text-xs items-center ring-[1.5px] ring-gray-300 px-2 '>
            <Image src={"/search.png"} alt={"search"} height={14} width={14} />
            <input type='text' placeholder='Search' className='bg-transparent outline-none p-2 w-[200px]' />
        </div>
        {/*Icons And Users*/}
        <div className='flex items-center gap-6 justify-end w-full'>
            <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
                <Image src={"/message.png"} alt={"message"} height={20} width={20} />
            </div>
            <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
                <Image src={"/announcement.png"} alt={"message"} height={20} width={20} />
                <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-600 text-white rounded-full text-xs'>1</div>
            </div>
            <div className='flex flex-col'>
                <span className='text-xs leading-3 font-medium'>John Doe</span>
                <span className='text-[10px] text-gray-500 text-right'>Admin</span>
            </div>
            <div>
                <Image src={"/avatar.png"} alt={""} height={36} width={36} className="rounded-full" />
            </div>
        </div>
    </div>
)

export default Navbar