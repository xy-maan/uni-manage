import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge';

export default function CardCompleteProfile({role}:{role:string}) {
  return (
     <Card className="p-0 mb-8 border-2">
      <CardContent className="p-6">
          <div className="flex items-center gap-4">
  
  <div className="bg-primary rounded-full size-16 flex items-center justify-center text-2xl">MH</div>
  <div className="">
  <h3 className="font-semibold text-lg">Mariam Ahmed</h3>
  <p className="text-sm text-muted-foreground">mariam.ahmed@gmail.com</p>
{role && (
  <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 capitalize">
    {role}
  </Badge>
)}
  </div>
          </div>
      </CardContent>
  </Card>
  )
}
