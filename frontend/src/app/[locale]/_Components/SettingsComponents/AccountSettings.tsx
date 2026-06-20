import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function AccountSettings() {
  return (
                <div className="space-y-6">
            <Card className="border  p-0">
              <CardHeader className='p-6 pb-0'>
             <h4 className="leading-none">Account Information</h4>
             <p className="text-muted-foreground">Update your account details</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground p-6 pt-0">
      <form className='space-y-4'>
        <div className="grid md:grid-cols-2 gap-4">

          <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2' htmlFor="First Name">First Name</FieldLabel>
      <Input value="mariem" id="First Name" type="text" />
    </Field>
             <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2' htmlFor="Last Name">Last Name</FieldLabel>
      <Input value="hussein" id="Last Name" type="text" />
    </Field>
        </div>
          <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2' htmlFor="Email">Email Address</FieldLabel>
      <Input value="mariem" id="Email" type="email" />
    </Field>
       <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2' htmlFor="Phone Number">Phone Number</FieldLabel>
      <Input value="0100" id="Phone Number" type="phone" />
    </Field>
    <div className="flex gap-2">
      <Button>Save Changes</Button>
      <Button variant="outline">Cancel</Button>
    </div>
      </form>
              </CardContent>
            </Card>
      <Card className='border border-destructive/50 p-0'>
<CardHeader className='p-6 pb-0'>
<h4 className="leading-none text-destructive">Delete Account</h4>
<p className="text-muted-foreground">Permanently delete your account and all associated data</p>
</CardHeader>
<CardContent className='p-6 pt-0'>
<p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
<Button className='bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 h-9'>
<Trash2 className='mr-2 size-4'/>
Delete Account
</Button>
</CardContent>
        </Card>
          </div>
  )
}
