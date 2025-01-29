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
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)


  const handleMainDivClick = () => {
    setIsColorPickerOpen(true)
  }

  const handleColorChange = (color: string) => {
    setBgColor(color)
  }


  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="space-y-4">
      <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <div
              className="w-full h-32 rounded-lg cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={handleMainDivClick}
              style={{ backgroundColor: bgColor }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <HexColorPicker color={bgColor} onChange={handleColorChange} />
          </PopoverContent>
        </Popover>
        <div className="relative">
          <div className="absolute -top-14 left-4 border-2 border-accent rounded-full bg-white">
            <Avatar onClick={onAvatarClick} className="cursor-pointer w-14 h-14">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <div className="flex items-center space-x-2">
            <Input
              className="flex-1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isUsernameEditing}
            />
            {isUsernameEditing ? (
              <Button onClick={() => setIsUsernameEditing(false)} className="bg-[#693d52] text-white hover:bg-[#532e40]" variant="secondary">
                Save
              </Button>
            ) : (
              <Button onClick={() => setIsUsernameEditing(true)} className="hover:bg-[#919192] hover:text-white" variant="secondary">
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <div className="flex items-center space-x-2">
            {isDepartmentEditing ? (
              <Select
                value={collegeDepartment}
                onValueChange={setCollegeDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAF">
                    College of Accountancy and Finance (CAF)
                  </SelectItem>
                  <SelectItem value="CADBE">
                    College of Architecture, Design and the Built Environment (CADBE)
                  </SelectItem>
                  <SelectItem value="CAL">
                    College of Arts and Letters (CAL)
                  </SelectItem>
                  <SelectItem value="CBA">
                    College of Business Administration (CBA)
                  </SelectItem>
                  <SelectItem value="COC">
                    College of Communication (COC)
                  </SelectItem>
                  <SelectItem value="CCIS">
                    College of Computer and Information Sciences (CCIS)
                  </SelectItem>
                  <SelectItem value="COED">
                    College of Education (COED)
                  </SelectItem>
                  <SelectItem value="COE">
                    College of Engineering (COE)
                  </SelectItem>
                  <SelectItem value="CHK">
                    College of Human Kinetics (CHK)
                  </SelectItem>
                  <SelectItem value="CL">
                    College of Law (CL)
                  </SelectItem>
                  <SelectItem value="CPSPA">
                    College of Political Science and Public Administration (CPSPA)
                  </SelectItem>
                  <SelectItem value="CSSD">
                    College of Social Sciences and Development (CSSD)
                  </SelectItem>
                  <SelectItem value="CS">
                    College of Science (CS)
                  </SelectItem>
                  <SelectItem value="CTHTM">
                    College of Tourism, Hospitality, and Transportation Management (CTHTM)
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="flex-1"
                placeholder="Select Department"
                value={collegeDepartment}
                disabled
              />
            )}
            {isDepartmentEditing ? (
              <Button onClick={() => setIsDepartmentEditing(false)} className="bg-[#693d52] text-white hover:bg-[#532e40]" variant="secondary">
                Save
              </Button>
            ) : (
              <Button onClick={() => setIsDepartmentEditing(true)} className="hover:bg-[#919192] hover:text-white" variant="secondary">
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="flex items-center space-x-2">
            <Input className="flex-1" type="password" value="********" disabled />
            <Button onClick={onPasswordEdit} className="hover:bg-[#919192] hover:text-white" variant="secondary">
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button className="bg-[#682A43] text-white hover:bg-[#532e40]">
          Save Changes
        </Button>
      </div>
    </div>
  );
}