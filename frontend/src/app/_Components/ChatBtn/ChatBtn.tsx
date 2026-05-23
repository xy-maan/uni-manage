"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {  MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from "next/link";
export default function ChatBtn() {
    const pathname = usePathname();
  return (
      // <Link
              //   href={`/${role}/projects`}
              //   className={`flex ${ pathname == `/${role}/projects`? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                      
              //     `}
              //   aria-current="page"
              // >

        <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md relative p-0 text-accent-foreground has-[>svg]:px-0">
     <MessageCircle className="size-3.5"/>
        </Button>
        // </Link>
  )
}
