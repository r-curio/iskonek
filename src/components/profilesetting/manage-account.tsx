'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle } from 'lucide-react'

export default function ManageAccount() {
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <div className="flex-1 p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Account Deletion</h2>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-800">Warning</p>
            <p className="text-sm text-red-600">
              Deleting your account will permanently remove all your data, including your profile, settings, and activity history.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input 
              type="password" 
              className="h-11 border-gray-200 focus:border-red-300 focus:ring-red-200"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <Input 
              type="password" 
              className="h-11 border-gray-200 focus:border-red-300 focus:ring-red-200"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="confirm" 
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
            />
            <label 
              htmlFor="confirm" 
              className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that this action is permanent and irreversible
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          disabled={!isConfirmed}
          className="bg-red-600 text-white hover:bg-red-700 h-11 px-8 transition-colors"
        >
          Delete Account
        </Button>
      </div>
    </div>
  )
}

