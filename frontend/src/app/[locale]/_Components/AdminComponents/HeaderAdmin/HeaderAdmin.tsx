"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger,SheetHeader } from '@/components/ui/sheet'
import { LogOut, Menu, Shield, X } from 'lucide-react'
import React, { useState } from 'react'
import SidebarAdmin from '../SidebarAdmin/SidebarAdmin'

export default function HeaderAdmin({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}){

  return (
   <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-60 w-full">

      <div className='px-4 lg:px-8 py-4 header-admin w-full'>
        <div className="flex items-center justify-between w-full">
         <div className="flex items-center gap-3">
   

    <Button  onClick={() => setSidebarOpen(!sidebarOpen)} className='lg:hidden bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md ' >
        {sidebarOpen? <X/> :<Menu />}
    
    </Button>
  
               <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center ">
                    <Shield className="size-6 text-white"/>
                </div>
               <div className="">
                 <h1 className="text-xl lg:text-2xl font-bold">Platform Administration</h1>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">System-wide management and oversight</p>
               </div>
            </div>
         </div>
            <div className="flex items-center gap-3">
                <Badge className="border-success/20 bg-success/10 text-success hidden lg:block">System Health: 98%</Badge>
                <Button variant="outline">
                    <LogOut className="size-4"/>
                    <span className="hidden sm:inline">Logout</span>
                    
                </Button>
            </div>
        </div>


    </div>
   </div>
  )
}
