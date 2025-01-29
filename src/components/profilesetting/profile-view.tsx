'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ProfileViewProps {
  onPasswordEdit: () => void;
  onAvatarClick: () => void;
  name: string;
  department: string;
}

export default function ProfileView({ onPasswordEdit, onAvatarClick, name, department }: ProfileViewProps) {
  const [username, setUsername] = useState(name);
  const [collegeDepartment, setCollegeDepartment] = useState(department);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [bgColor, setBgColor] = useState("#f3f4f6") // Default background color
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
          <div className="absolute -top-16 left-4">
            <div
              className="h-20 w-20 rounded-full bg-muted border-4 border-background cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onAvatarClick}
              role="button"
              tabIndex={0}
              aria-label="Change profile picture"
            />
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
                value={department}
                onValueChange={setDepartment}
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
                  <SelectItem value="College of Communication (COC)">
                    College of Communication (COC)
                  </SelectItem>
                  <SelectItem value="College of Computer and Information Sciences (CCIS)">
                    College of Computer and Information Sciences (CCIS)
                  </SelectItem>
                  <SelectItem value="College of Education (COED)">
                    College of Education (COED)
                  </SelectItem>
                  <SelectItem value="College of Engeneering (COE)">
                    College of Engineering (COE)
                  </SelectItem>
                  <SelectItem value="College of Human Kinetics (CHK)">
                    College of Human Kinetics (CHK)
                  </SelectItem>
                  <SelectItem value="College of Law (CL)">
                    College of Law (CL)
                  </SelectItem>
                  <SelectItem value="College of Political Science and Public Administration (CPSPA)">
                    College of Political Science and Public Administration (CPSPA)
                  </SelectItem>
                  <SelectItem value="College of Social Sciences and Development (CSSD)">
                    College of Social Sciences and Development (CSSD)
                  </SelectItem>
                  <SelectItem value="College of Science (CS)">
                    College of Science (CS)
                  </SelectItem>
                  <SelectItem value="College of Tourism, Hospitality, and Transportation Management (CTHTM)">
                    College of Tourism, Hospitality, and Transportation Management (CTHTM)
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="flex-1"
                placeholder="Select Department"
                value={department}
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