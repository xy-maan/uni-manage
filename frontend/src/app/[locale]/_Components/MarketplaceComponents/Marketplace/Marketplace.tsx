"use client"
import { GetStudentDataAction } from '@/Actions/getStudentData.action'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import React, { useEffect ,useState} from 'react'
import CardMarketplace from '../CardMarketplace'

export default function Marketplace() { 
  const [switchLayout, setSwitchLayout] = useState<string>("grid")
  return (
   <div className="">
     <div className='flex items-center justify-between mb-8'>
<p className="text-sm text-muted-foreground">8 projects found</p>
<div className="flex items-center gap-2 border rounded-lg p-1">

  <Button  onClick={()=>setSwitchLayout("grid")} className={`${switchLayout=="grid" ?"":"bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"} h-8 py-0 px-3 has-[>svg]:px-2.5 `} >
    <LayoutGrid className='size-4'/>
    Grid
  </Button>
    <Button onClick={()=>setSwitchLayout("list")} className={`${switchLayout=="list" ?"":"bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"} h-8 py-0  px-3  has-[>svg]:px-2.5`} >
    <List className='size-4'/>
    List
  </Button>
</div>
    </div>
<div className={`grid ${switchLayout=="grid"?" grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6":"grid-cols-1"} `}>
  <CardMarketplace switchLayout={switchLayout}/>
  <CardMarketplace switchLayout={switchLayout}/>
</div>
   </div>
  )
}
