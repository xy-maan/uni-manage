import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Globe, Lock, Trash2, User } from 'lucide-react'
import React from 'react'

export default function Security() {
  return (
             <div className="space-y-6">
            <Card className="border  p-0">
              <CardHeader className='p-6 pb-0'>
             <h4 className="leading-none">Change Password</h4>
             <p className="text-muted-foreground">Update your password regularly for security</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground p-6 pt-0">
      <form className='space-y-4'>
  
          <Field className="gap-0 text-foreground ">
      <FieldLabel className='mb-2' htmlFor="Current Password">Current Password</FieldLabel>
      <Input value="mariem" id="currentPassword" type="password" />
    </Field>
      <Field className="gap-0 text-foreground ">
      <FieldLabel className='mb-2' htmlFor="NewPassword">New Password</FieldLabel>
      <Input value="mariem" id="newPassword" type="password" />
    </Field>
          <Field className="gap-0 text-foreground ">
      <FieldLabel className='mb-2' htmlFor="Confirm New Password">Confirm New Password</FieldLabel>
      <Input value="mariem" id="confirmNewPassword" type="password" />
    </Field>
    <div className="flex gap-2">
      <Button>Update Password</Button>
    </div>
      </form>
              </CardContent>
            </Card>
     
          </div>
  )
}
