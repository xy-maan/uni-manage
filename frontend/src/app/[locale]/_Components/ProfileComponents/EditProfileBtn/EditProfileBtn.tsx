"use client"
import { Button } from '@/components/ui/button'
import { SquarePen } from 'lucide-react'
import React from 'react'

export default function EditProfileBtn() {
  return (
  <Button variant={'outline'}>
<SquarePen className=' mr-2 size-4'/>
Edit Profile
  </Button>

  )
}
