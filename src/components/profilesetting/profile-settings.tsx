'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CgProfile } from 'react-icons/cg';
import { FaUserGear } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useRouter } from 'next/navigation';

interface ProfileSettingsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function ProfileSettings({ activeView, onViewChange }: ProfileSettingsProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleViewChange = (view: string) => {
    onViewChange(view);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        router.replace('/auth/login');
        router.refresh();
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <div className="w-48 border-r h-full bg-[#FAF9F6] flex flex-col justify-between">
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
        <Button 
          variant="ghost" 
          className="justify-start w-full text-[#693d52] hover:bg-[#532e40] hover:text-white" 
          onClick={handleLogoutClick}
          disabled={isLoading}
        >
          <CiLogout className="mr-2 h-4 w-4" />
          {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg z-50">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout?</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-2">
              <Button 
                className="hover:bg-[#919192] hover:text-white" variant="secondary"
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#693d52] text-white hover:bg-[#532e40]"
                onClick={handleConfirmClick}
                disabled={isLoading}
              >
                {isLoading ? 'Logging out...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

