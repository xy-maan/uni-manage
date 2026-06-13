"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {  MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Link } from '@/i18n/navigation';
export default function ChatBtn() {
    const pathname = usePathname();
  return (

        <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md relative p-0 text-accent-foreground has-[>svg]:px-0">
     <MessageCircle className="size-3.5"/>
        </Button>
        // </Link>
  )
}
