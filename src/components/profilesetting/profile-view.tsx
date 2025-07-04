"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ProfileViewProps {
  onPasswordEdit: () => void;
  onAvatarClick: () => void;
  name: string;
  department: string;
  avatarUrl?: string;
  color?: string;
}

export default function ProfileView({
  onPasswordEdit,
  onAvatarClick,
  name,
  department,
  avatarUrl,
  color,
}: ProfileViewProps) {
  const [username, setUsername] = useState(name);
  const [collegeDepartment, setCollegeDepartment] = useState(department);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [bgColor, setBgColor] = useState(color);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value);
    setHasChanges(true);
  };

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
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          department: collegeDepartment,
          bgColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error updating profile",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully",
      });

      setHasChanges(false);
      setIsUsernameEditing(false);
      setIsDepartmentEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 flex flex-col h-full">
      {/* Top section with banner and avatar */}
      <div className="space-y-4 mb-6 sm:mb-8">
        <div className="relative">
          <div
            className="w-full h-20 sm:h-28 rounded-xl shadow-sm"
            style={{ backgroundColor: bgColor }}
          />
          <div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-sm">
            <label
              htmlFor="colorPicker"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Banner Color:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={bgColor}
              onChange={handleColorChange}
              className="w-6 h-6 sm:w-8 sm:h-8 p-0 border-0 rounded cursor-pointer"
            />
          </div>
          <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-6 border-4 border-white rounded-full bg-white shadow-md transition-transform hover:scale-105">
            <Avatar
              onClick={onAvatarClick}
              className="cursor-pointer w-16 h-16 sm:w-24 sm:h-24"
            >
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-sm sm:text-base">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Middle section with form fields */}
      <div className="flex-1 space-y-6 sm:space-y-8 mt-6 sm:mt-8">
        {/* Username section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              className="flex-1 h-10 sm:h-11 rounded-lg border-gray-200 focus:border-[#693d52] focus:ring-[#693d52] text-sm sm:text-base"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              disabled={!isUsernameEditing}
            />
            <Button
              onClick={() => setIsUsernameEditing(!isUsernameEditing)}
              className="hover:bg-[#919192] hover:text-white w-full sm:w-auto text-sm"
              variant="secondary"
            >
              {isUsernameEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </div>

        {/* Department section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Department
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {isDepartmentEditing ? (
              <>
                <Select
                  value={collegeDepartment}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAF">
                      College of Accountancy and Finance (CAF)
                    </SelectItem>
                    <SelectItem value="CADBE">
                      College of Architecture, Design and the Built Environment
                      (CADBE)
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
                    <SelectItem value="CL">College of Law (CL)</SelectItem>
                    <SelectItem value="CPSPA">
                      College of Political Science and Public Administration
                      (CPSPA)
                    </SelectItem>
                    <SelectItem value="CSSD">
                      College of Social Sciences and Development (CSSD)
                    </SelectItem>
                    <SelectItem value="CS">College of Science (CS)</SelectItem>
                    <SelectItem value="CTHTM">
                      College of Tourism, Hospitality, and Transportation
                      Management (CTHTM)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setIsDepartmentEditing(false)}
                  className="hover:bg-[#919192] hover:text-white w-full sm:w-auto text-sm"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Input className="flex-1 h-10 sm:h-11 text-sm sm:text-base" value={collegeDepartment} disabled />
                <Button
                  onClick={() => setIsDepartmentEditing(true)}
                  className="hover:bg-[#919192] hover:text-white w-full sm:w-auto text-sm"
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
      <div className="pt-4 sm:pt-6 mt-auto border-t flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <Button
          onClick={onPasswordEdit}
          className="h-10 sm:h-11 px-4 sm:px-6 hover:bg-[#919192] hover:text-white transition-colors text-sm w-full sm:w-auto"
          variant="secondary"
        >
          Change Password
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={!hasChanges || isLoading}
          className="h-10 sm:h-11 px-6 sm:px-8 bg-[#682A43] text-white hover:bg-[#532e40] transition-colors text-sm w-full sm:w-auto"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
