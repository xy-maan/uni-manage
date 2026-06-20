import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
export default function NotificationsSettings() {
  return (
             <div className="space-y-6">
            <Card className="border p-0">
              <CardHeader className='p-6 pb-0'>
             <h4 className="leading-none ">Notification Preferences</h4>
             <p className="text-muted-foreground">Choose how you want to be notified</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground p-6 pt-0 text-foreground ">
    <div className="">
      <form className='space-y-6'>
<div className="space-y-4">
                <h4 className="mb-4 text-[16px]">
                Email Notifications
            </h4>
     <Field orientation="horizontal" className="gap-0  justify-between">
      <FieldContent className="gap-0.5 ">
        <FieldLabel htmlFor="Task-assignments" className="leading-none font-medium text-[16px]">
         Task assignments
        </FieldLabel>
        <FieldDescription className="text-sm">
       Get notified when you're assigned a task
        </FieldDescription>
      </FieldContent>
      <Switch id="Task-assignments" />
    </Field>
       <Separator className="" />
     <Field orientation="horizontal" className="gap-0  justify-between">
      <FieldContent className="gap-0.5 ">
        <FieldLabel htmlFor="Comments-mentions" className="leading-none font-medium text-[16px]">
        Comments and mentions
        </FieldLabel>
        <FieldDescription className="text-sm">
      Get notified when someone comments or mentions you
        </FieldDescription>
      </FieldContent>
      <Switch id="Comments-mentions" />
    </Field>
       <Separator className="" />
         <Field orientation="horizontal" className="gap-0  justify-between">
      <FieldContent className="gap-0.5 ">
        <FieldLabel htmlFor="Supervisor-feedback" className="leading-none font-medium text-[16px]">
       Supervisor feedback
        </FieldLabel>
        <FieldDescription className="text-sm">
     Get notified when your supervisor provides feedback
        </FieldDescription>
      </FieldContent>
      <Switch id="Supervisor-feedback" />
    </Field>
      <Separator className="" />
              <Field orientation="horizontal" className="gap-0  justify-between">
      <FieldContent className="gap-0.5 ">
        <FieldLabel htmlFor="Team-updates" className="leading-none font-medium text-[16px]">
     Team updates
        </FieldLabel>
        <FieldDescription className="text-sm">
     Get notified about team member changes
        </FieldDescription>
      </FieldContent>
      <Switch id="Team-updates" />
    </Field>
</div>
       <Separator className="" />
<div className="space-y-4">
       <h4 className="mb-4 text-[16px]">Push Notifications</h4>
     <Field orientation="horizontal" className="gap-0  justify-between">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="Enable-push-notifications" className="leading-none font-medium text-[16px]">
        Enable push notifications
        </FieldLabel>
        <FieldDescription className="text-sm">
      Receive notifications on your device
        </FieldDescription>
      </FieldContent>
      <Switch id="Enable-push-notifications" />
    </Field>
       <Separator className="" />
     <Field orientation="horizontal" className="gap-0  justify-between">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="Deadline-reminders" className="leading-none font-medium text-[16px]">
        Deadline reminders
        </FieldLabel>
        <FieldDescription className="text-sm">
      Get reminded about upcoming deadlines
        </FieldDescription>
      </FieldContent>
      <Switch id="Deadline-reminders" />
    </Field></div>
 
    <div className=" pt-4">
      <Button className="text-sm!">Save Preferences</Button>
    </div>
      </form>
    </div>
              </CardContent>
            </Card>
   
          </div>
  )
}
