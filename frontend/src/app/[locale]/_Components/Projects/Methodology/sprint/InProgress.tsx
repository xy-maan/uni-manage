import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {  CirclePlay, EllipsisVertical, Plus } from 'lucide-react'
export default function InProgress() {
  return (
     <Card className='border in-progess p-0 gap-2 lg:gap-6 flex flex-col bg-primary/5 border-primary/20 '>
    <CardHeader className='px-6 pt-6 pb-3'>
<div className="flex justify-between items-center">
  <div className="left-side flex items-center gap-2">
<CirclePlay className='size-4 text-primary'/>
<h4>To Do</h4>
<Badge className='border-transparent bg-primary/20 text-secondary-foreground [a&]:hover:bg-primary/90 text-xs'>2</Badge>
  </div>
    <div className="size-8" />
</div>
    </CardHeader>
    <CardContent className='task transition-all cursor-pointer  px-6 pb-6 space-y-3'>
    <div className="flex flex-col  bg-background rounded-xl p-4 border hover:border-primary">

<div className="flex items-start justify-between gap-2 mb-3">
  <h3 className='text-sm font-medium leading-tight'>Design dashboard UI</h3>
  <Button className='size-6 -mt-1 bg-transparent'>
    <EllipsisVertical className='size-3'/>
  </Button>
</div>
<div className="flex items-center justify-between mb-3">
  <Badge className='bg-muted flex size-6 items-center justify-center rounded-full text-xs'>
  A
  </Badge>
  <div className="flex items-center gap-2">
    <Badge className='bg-warning/10 text-warning border-warning/20 text-xs'>medium</Badge>
    <Badge className='bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs'>3pts</Badge>
  </div>
</div>
    </div>
     <div className="flex flex-col  bg-background rounded-xl  p-4 border hover:border-primary">

<div className="flex items-start justify-between gap-2 mb-3">
  <h3 className='text-sm font-medium leading-tight'>Design dashboard UI</h3>
  <Button className='size-6 -mt-1 bg-transparent hover:bg-transparent'>
    <EllipsisVertical className='size-3'/>
  </Button>
</div>
<div className="flex items-center justify-between mb-3">
  <Badge className='bg-muted flex size-6 items-center justify-center rounded-full text-xs'>
  A
  </Badge>
  <div className="flex items-center gap-2">
    <Badge className='bg-warning/10 text-warning border-warning/20 text-xs'>medium</Badge>
    <Badge className='bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs'>3pts</Badge>
  </div>
</div>
    </div>
    </CardContent>
    </Card>
  )
}
