import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import React from 'react'

export default function HeaderMeth({variant}:{variant:string}) {
  return (
    <div>
      <div className="mb-6 flex justify-between lg:items-center items-start">
      <div className="">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="name-project">
            Name Project
          </h1>
          <Badge className='type-project bg-primary/10 text-primary'>
          Graduation Project</Badge>
        </div>
        <p className='type-meth text-sm text-muted-foreground'>
                    {variant=="sprint"&& "Methodology: Sprint-Based (Agile)"}
                    {variant=="milestone"&& "Methodology: Milestone-Based (Waterfall)"}
                    {variant=="flexible"&& "Methodology: Flexible Board (Kanban)"}          
</p>
      </div>
<Button variant="outline"><Users className='mr-2 size-4'/> Manage Team</Button>
      </div>
    </div>
  )
}
