'use client'
import Image from 'next/image'
import Logo from '@/images/logo.svg'
import { BsChatLeftFill, BsFillPeopleFill, BsSearch} from "react-icons/bs";
import { CustomInput } from './custom-input';
import { SectionDivider } from '../ui/section-divider';
import { ContactsList } from './contacts-list';
import { useEffect, useState } from 'react';
import UserProfile from './user-profile';

const contacts = [
    { id: '2', name: 'Alice Smith', avatarUrl: '/placeholder.svg?height=32&width=32' },
    { id: '3', name: 'Bob Johnson', avatarUrl: '/placeholder.svg?height=32&width=32' },
    { id: '4', name: 'Carol Williams', avatarUrl: '/placeholder.svg?height=32&width=32' },
    { id: '5', name: 'David Brown', avatarUrl: '/placeholder.svg?height=32&width=32' },
  ]

  const currentUser = {
    id: '1',
    name: 'John Doe',
    avatarUrl: 'https://github.com/shadcn.png',
  }

export default function Sidebar() {

    const [selectedContact, setSelectedContact] = useState <{id: string, name: string, avatarUrl: string} | null>(null)

    useEffect(() => {
        console.log(selectedContact)
    }, [selectedContact])

    return (
        <div className="w-1/5 max-w-1/5 bg-[#FAF9F6] min-h-screen flex flex-col justify-between">
            <div>
                <div className='flex items-center z-10 shadow-lg max-h-16 gap-4 px-4 py-4'>
                    <Image src={Logo} alt='logo' width={50} height={50}/>
                    <h1 className='text-3xl font-bold text-accent '>Isko<span className='text-[#C6980F]'>nek</span></h1>
                </div>
                <div className='pt-4 px-4 flex flex-col gap-4'>
                    <div className='flex items-center gap-5 py-2 px-4 rounded-lg hover:bg-[#F0EDEA] cursor-pointer'>
                        <BsChatLeftFill className='text-xl'/>
                        <h1 className='text-lg'>New Chat</h1>
                    </div>
                    <div className='flex items-center gap-5 py-2 px-4 rounded-lg hover:bg-[#F0EDEA] cursor-pointer'>
                        <BsFillPeopleFill className='text-xl'/>
                        <h1 className='text-lg'>Add Friends</h1>
                    </div>
                    <div className=''>
                        <CustomInput icon={BsSearch} placeholder='Search' className='bg-gray-100 border-gray-400 border-2'/>
                    </div>
                </div>
                <SectionDivider text='Direct Messages'/>
                <ContactsList contacts={contacts} onSelectContact={setSelectedContact}/>
            </div>

            <div className='h-20 border-t'>
                <UserProfile avatarUrl={currentUser.avatarUrl} name={currentUser.name}/>
            </div>
        </div>
    )
}