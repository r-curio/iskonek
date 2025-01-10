'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ManageAccount() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-semibold mb-6">Account Deletion</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <Input type="password" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-[#693d52] text-white hover:bg-[#532e40]" variant="default">
          Delete Account
        </Button>
      </div>
    </div>
  )
}

