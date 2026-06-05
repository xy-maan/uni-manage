import { Button } from '@/components/ui/button'
import { ArrowLeft,Layers } from 'lucide-react'
import React from 'react'

export default function HeaderCompleteProfile({handleBack,step}:{handleBack:()=>void; step:number}) {
  return (
       <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
<Button variant="outline" onClick={handleBack}> <ArrowLeft className="size-4"/>  {step > 1 ? "Back" : "Back to Home"}
</Button>
          <div className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="flex  size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Layers className="size-4"/>
            </div>
              <span className="self-center text-2xl font-bold  text-heading  whitespace-nowrap bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                UniManage
            </span>

          </div>
          <div className="w-30"></div>
        </div>
      </div>

      </div>
  )
}
