"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {  Search } from 'lucide-react'
export default function SearchNavbarBtn() {
  return (
      <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md relative p-0  has-[>svg]:px-0 text-accent-foreground">
     <Search className="size-3.75"/>
        </Button>
  )
}
