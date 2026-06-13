"use client"
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export default function FilteringNotifications() {
  return (
        <Select >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All Notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                 <SelectItem value="all">All Notifications</SelectItem>
                 <SelectItem value="all">Team Invitations</SelectItem>
      
              </SelectGroup>
            </SelectContent>
          </Select>
  )
}
