import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function PreferencesSettings() {
  return (
<div className="space-y-6">
   <Card className="border  p-0">
              <CardHeader className='p-6 pb-0'>
             <h4 className="leading-none">Display Preferences</h4>
             <p className="text-muted-foreground">Customize how you see the platform</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground p-6 pt-0">

<div className="space-y-4">
       <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2 text-foreground' htmlFor="Language">Language</FieldLabel>
        <Select>
      <SelectTrigger className="w-full max-w-full text-foreground">
        <SelectValue placeholder="Select your Language" className="text-foreground " />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="arabic">Arabic</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    </Field>
         <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2' htmlFor="Timezone">Timezone</FieldLabel>
        <Select>
      <SelectTrigger className="w-full  max-w-full">
        <SelectValue placeholder="Select your Timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Timezone</SelectLabel>
          <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
          <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    </Field>
       <Separator className="" />
     <Field orientation="horizontal" className="gap-0  justify-between ">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="dark-mode" className="leading-none leading-none font-medium text-[16px] text-foreground" >
        Dark mode
        </FieldLabel>
        <FieldDescription className="text-sm">
     Use dark theme throughout the platform
        </FieldDescription>
      </FieldContent>
      <Switch id="dark-mode" />
    </Field>
</div>

              </CardContent>
            </Card>
               <Card className="border p-0">
              <CardHeader className='p-6 pb-0'>
             <h4 className="leading-none">Privacy Settings</h4>
             <p className="text-muted-foreground">Control who can see your information</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground p-6 pt-0">

<div className="space-y-4">
       <Field className="gap-0 text-foreground">
      <FieldLabel className='mb-2 text-sm' htmlFor="Profile-Visibility">Profile Visibility</FieldLabel>
        <Select>
      <SelectTrigger className="w-full  max-w-full text-foreground">
        <SelectValue placeholder="Select a Profile Visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
             <SelectItem value="public">Public - Anyone can view</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    </Field>
       <Separator className="" />
     <Field orientation="horizontal" className="gap-0  justify-between ">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="online-status" className="leading-none font-medium text-foreground text-[16px]">
       Show online status
        </FieldLabel>
        <FieldDescription className="text-sm">
  Let others see when you're online
        </FieldDescription>
      </FieldContent>
      <Switch id="online-status" />
    </Field>
           <Separator className="" />
     <Field orientation="horizontal" className="gap-0  justify-between ">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="team-invitations" className="leading-none font-medium text-foreground text-[16px]">
       Allow team invitations
        </FieldLabel>
        <FieldDescription className="text-sm">
Allow teams to send you join requests
        </FieldDescription>
      </FieldContent>
      <Switch id="team-invitations" />
    </Field>
</div>


              </CardContent>
            </Card>
    <div className="flex gap-2">
      <Button>Save Preferences</Button>
      <Button variant="outline">Reset to Defaults</Button>
    </div>
</div>
   
  )
}
