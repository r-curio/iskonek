'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { HexColorPicker } from "react-colorful"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ProfileViewProps {
  onPasswordEdit: () => void;
  onAvatarClick: () => void;
  name: string;
  department: string;
  avatarUrl?: string;
}

export default function ProfileView({ onPasswordEdit, onAvatarClick, name, department, avatarUrl }: ProfileViewProps) {
  const [username, setUsername] = useState(name);
  const [collegeDepartment, setCollegeDepartment] = useState(department);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [bgColor, setBgColor] = useState("#693d52"); 
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleMainDivClick = () => {
    setIsColorPickerOpen(true);
  }

  const handleColorChange = (color: string) => {
    setBgColor(color);
    setHasChanges(true);
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setHasChanges(true);
  };

  const handleDepartmentChange = (value: string) => {
    setCollegeDepartment(value);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          department: collegeDepartment,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile update response:', data);
      setHasChanges(false);
      setIsUsernameEditing(false);
      setIsDepartmentEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col h-full">
      {/* Top section with banner and avatar */}
      <div className="space-y-4 mb-8">
        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <div
              className="w-full h-28 rounded-xl cursor-pointer transition-all duration-300 hover:opacity-90 shadow-sm"
              role="button"
              tabIndex={0}
              onClick={handleMainDivClick}
              style={{ backgroundColor: bgColor }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 rounded-lg">
            <HexColorPicker color={bgColor} onChange={handleColorChange} />
          </PopoverContent>
        </Popover>
        <div className="relative">
          <div className="absolute -top-20 left-6 border-4 border-white rounded-full bg-white shadow-md transition-transform hover:scale-105">
            <Avatar onClick={onAvatarClick} className="cursor-pointer w-24 h-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Middle section with form fields */}
      <div className="flex-1 space-y-8">
        {/* Username section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <div className="flex items-center space-x-3">
            <Input
              className="flex-1 h-11 rounded-lg border-gray-200 focus:border-[#693d52] focus:ring-[#693d52]"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              disabled={!isUsernameEditing}
            />
            <Button 
              onClick={() => setIsUsernameEditing(!isUsernameEditing)}
              className="hover:bg-[#919192] hover:text-white" 
              variant="secondary"
            >
              {isUsernameEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Department section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Department</label>
          <div className="flex items-center space-x-3">
            {isDepartmentEditing ? (
              <>
                <Select
                  value={collegeDepartment}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAF">College of Accountancy and Finance (CAF)</SelectItem>
                    <SelectItem value="CADBE">College of Architecture, Design and the Built Environment (CADBE)</SelectItem>
                    <SelectItem value="CAL">College of Arts and Letters (CAL)</SelectItem>
                    <SelectItem value="CBA">College of Business Administration (CBA)</SelectItem>
                    <SelectItem value="COC">College of Communication (COC)</SelectItem>
                    <SelectItem value="CCIS">College of Computer and Information Sciences (CCIS)</SelectItem>
                    <SelectItem value="COED">College of Education (COED)</SelectItem>
                    <SelectItem value="COE">College of Engineering (COE)</SelectItem>
                    <SelectItem value="CHK">College of Human Kinetics (CHK)</SelectItem>
                    <SelectItem value="CL">College of Law (CL)</SelectItem>
                    <SelectItem value="CPSPA">College of Political Science and Public Administration (CPSPA)</SelectItem>
                    <SelectItem value="CSSD">College of Social Sciences and Development (CSSD)</SelectItem>
                    <SelectItem value="CS">College of Science (CS)</SelectItem>
                    <SelectItem value="CTHTM">College of Tourism, Hospitality, and Transportation Management (CTHTM)</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => setIsDepartmentEditing(false)}
                  className="hover:bg-[#919192] hover:text-white" 
                  variant="secondary"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Input
                  className="flex-1"
                  value={collegeDepartment}
                  disabled
                />
                <Button 
                  onClick={() => setIsDepartmentEditing(true)}
                  className="hover:bg-[#919192] hover:text-white" 
                  variant="secondary"
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section with buttons */}
      <div className="pt-6 mt-auto border-t flex justify-end space-x-3">
        <Button 
          onClick={onPasswordEdit}
          className="h-11 px-6 hover:bg-[#919192] hover:text-white transition-colors" 
          variant="secondary"
        >
          Change Password
        </Button>
        <Button 
          onClick={handleSaveChanges}
          disabled={!hasChanges || isLoading}
          className="h-11 px-8 bg-[#682A43] text-white hover:bg-[#532e40] transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}