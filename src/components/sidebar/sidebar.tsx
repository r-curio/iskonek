import Image from 'next/image'
import Logo from '@/images/logo.svg'
import { BsChatLeftFill, BsFillPeopleFill, BsSearch  } from "react-icons/bs";
import { Input } from '@/components/ui/input';

export default function Sidebar() {



    return (
        <div className="w-1/5 max-w-1/5 bg-[#FAF9F6] min-h-screen">
            <div className='flex items-center z-10 shadow-lg border-r-[1px] border-black border-opacity-35'>
                <Image src={Logo} alt='logo' width={100} height={100}/>
                <h1 className='text-3xl font-bold text-accent '>Isko<span className='text-[#C6980F]'>nek</span></h1>
            </div>
            <div className='pt-4 px-4 border-r-[1px] border-black border-opacity-35 min-h-full'>
                <div className='flex items-center gap-5 py-2 px-4 rounded-lg hover:bg-[#F0EDEA] cursor-pointer'>
                    <BsChatLeftFill className='text-xl'/>
                    <h1 className='text-lg'>New Chat</h1>
                </div>
                <div className='flex items-center gap-5 py-2 px-4 rounded-lg hover:bg-[#F0EDEA] cursor-pointer'>
                    <BsFillPeopleFill className='text-xl'/>
                    <h1 className='text-lg'>Add Friends</h1>
                </div>
                <div className=''>
    
                </div>
            </div>
        </div>
    )
}