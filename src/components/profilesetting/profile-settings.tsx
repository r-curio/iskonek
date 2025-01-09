'use client'

import { Button } from '@/components/ui/button';
import { CgProfile } from 'react-icons/cg';
import { FaUserGear } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";

interface ProfileSettingsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function ProfileSettings({ activeView, onViewChange }: ProfileSettingsProps) {
  const handleViewChange = (view: string) => {
    onViewChange(view);
  };

  return (
    <div className="w-48 border-r h-full bg-background flex flex-col justify-between">
      <div className="flex flex-col space-y-1 p-2">
        <h2 className="text-lg font-semibold px-4 py-2">Settings</h2>
        <Button
          className={`justify-start ${activeView === 'profile' ? 'bg-[#682A43] text-white' : 'bg-transparent text-black hover:bg-[#682A43] hover:text-white'}`}
          onClick={() => handleViewChange('profile')}
        >
          <CgProfile className={`mr-2 h-4 w-4 ${activeView === 'profile' ? 'text-white' : 'text-black'}`} />
          Profile
          </Button>
          <Button
            className={`justify-start ${activeView === 'manage-account' ? 'bg-[#682A43] text-white' : 'bg-transparent text-black hover:bg-[#682A43] hover:text-white'}`}
            onClick={() => handleViewChange('manage-account')}
          >
            <FaUserGear className={`mr-2 h-4 w-4 ${activeView === 'manage-account' ? 'text-white' : 'text-black'}`} />
            Manage Account
          </Button>
      </div>
      <div className="p-2">
        <Button variant="ghost" className="justify-start text-destructive">
          <CiLogout className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}