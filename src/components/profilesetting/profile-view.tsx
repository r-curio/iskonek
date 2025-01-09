'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ProfileViewProps {
    onPasswordEdit: () => void
}

export default function ProfileView({ onPasswordEdit }: ProfileViewProps) {
    const [username, setUsername] = useState("iskofzz")
    const [department, setDepartment] = useState("")
    const [isUsernameEditing, setIsUsernameEditing] = useState(false)
    const [isDepartmentEditing, setIsDepartmentEditing] = useState(false)

    const handleMainDivClick = () => {
        // Handle the click event for the main div
        console.log("Main div clicked")
    }

    const handleProfilePicClick = () => {
        // Handle the click event for the profile picture
        console.log("Profile picture clicked")
    }

    return (
        <div className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
                <div
                    className="w-full h-32 bg-muted rounded-lg cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={handleMainDivClick}
                />
                <div className="relative">
                    <div className="absolute -top-16 left-4">
                        <div
                            className="h-20 w-20 rounded-full bg-muted border-4 border-background cursor-pointer"
                            onClick={handleProfilePicClick}
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
                            <Button
                                onClick={() => setIsUsernameEditing(false)}
                                className="bg-red-500 text-white hover:bg-red-600"
                                variant="secondary"
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsUsernameEditing(true)}
                                className="hover:bg-[#682A43] hover:text-white"
                                variant="secondary"
                            >
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
                  <SelectItem value="ccis">
                    College of Computer and Information Sciences (CCIS)
                  </SelectItem>
                  <SelectItem value="cea">
                    College of Engineering and Architecture (CEA)
                  </SelectItem>
                  <SelectItem value="cs">
                    College of Science (CS)
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
                            <Button
                                onClick={() => setIsDepartmentEditing(false)}
                                className="bg-red-500 text-white hover:bg-red-600"
                                variant="secondary"
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsDepartmentEditing(true)}
                                className="hover:bg-[#682A43] hover:text-white"
                                variant="secondary"
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="flex items-center space-x-2">
                        <Input className="flex-1" type="password" value="********" disabled />
                        <Button
                            onClick={onPasswordEdit}
                            className="hover:bg-[#682A43] hover:text-white"
                            variant="secondary">
                            Edit
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <Button className="bg-[#682A43] text-white" variant="destructive">
                    Delete Account
                </Button>
            </div>
        </div>
    )
}