"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Globe, Mail, Bell, Settings, Shield, Database, CircleAlert, Save } from "lucide-react";
import  {useState}  from "react";

export default function page() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="p-4 lg:p-8  max-w-5xl">
      <Card className="p-0 border-2 mb-6">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 leading-0">
            <Settings className="text-primary size-5" />
            <h3 className="">System Configuration</h3>
          </div>
          <p className="text-muted-foreground">
            Manage platform-wide settings and preferences
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
            <Field className="mb-6  gap-2">
      <FieldLabel htmlFor="Platform Name">Platform Name</FieldLabel>
      <Input id="Platform Name" type="password" />
      <FieldDescription className="text-xs">
       The name displayed across the platform
      </FieldDescription>
    </Field>

     <Field className="mb-6  gap-2">
    <FieldLabel htmlFor="Platform Name">Platform URL</FieldLabel>
      <InputGroup>
        <InputGroupInput id="Platform Name"  />
        <InputGroupAddon align="inline-start">
        <Globe className=" sizexs" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription className="text-xs">Icon positioned at the start.</FieldDescription>
    </Field>
         <Field className="mb-6  gap-2">
    <FieldLabel htmlFor="Support Email">Support Email</FieldLabel>
      <InputGroup>
        <InputGroupInput id="Support Email"  />
        <InputGroupAddon align="inline-start">
        <Mail className=" sizexs" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription className="text-xs">Contact email for user support</FieldDescription>
    </Field>
    
          
        </CardContent>
      </Card>
        <Card className="p-0 border-2 mb-6">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 leading-0">
            <Bell className="text-primary size-5" />
            <h3 className="">Notification Settings</h3>
          </div>
          <p className="text-muted-foreground">
           Configure admin notification preferences
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
 <Field orientation="horizontal" className="gap-0  justify-between py-3 mb-4">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="email-notifications" className="leading-none">
         Email Notifications
        </FieldLabel>
        <FieldDescription className="text-xs">
        Receive email alerts for critical system events
        </FieldDescription>
      </FieldContent>
      <Switch id="email-notifications" />
    </Field>
       <Separator className="mb-4" />
       <Field orientation="horizontal" className="gap-0  justify-between py-3">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="email-notifications" className="leading-none">
        Slack Integration
        </FieldLabel>
        <FieldDescription className="text-xs">
       Send notifications to Slack channels
        </FieldDescription>
      </FieldContent>
      <Switch id="email-notifications" />
    </Field>
        </CardContent>
      </Card>
           <Card className="p-0 border-2 mb-6 border-warning/20">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 leading-0">
            <Shield className="text-warning size-5" />
            <h3 className="">Security Settings</h3>
          </div>
          <p className="text-muted-foreground">
          Platform security and authentication controls
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
 <Field orientation="horizontal" className="gap-0  justify-between py-3 mb-4">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="email-notifications" className="leading-none">
        Two-Factor Authentication
        </FieldLabel>
        <FieldDescription className="text-sm text-muted-foreground">
        Require 2FA for all admin accounts
        </FieldDescription>
      </FieldContent>
      <Switch id="email-notifications" />
    </Field>
       <Separator className="mb-4" />
       <Field orientation="horizontal" className="gap-0  justify-between py-3 mb-3">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="email-notifications" className="leading-none">
        Auto-Approve Supervisor Accounts
        </FieldLabel>
        <FieldDescription className="text-sm text-muted-foreground">
       Automatically verify supervisor accounts from trusted domains
        </FieldDescription>
      </FieldContent>
      <Switch id="email-notifications" />
    </Field>
           <Separator className="mb-4" />
    <Field className=" gap-2 ">
      <FieldLabel htmlFor="Session Timeout">Session Timeout</FieldLabel>
     <div className="flex items-center gap-2">
       <Input id="Session Timeout" className="w-24" type="number" />
      <span className="text-sm text-muted-foreground">minutes</span>
     </div>
      <FieldDescription className="text-xs">
       Automatically log out inactive users
      </FieldDescription>
    </Field>

        </CardContent>
      </Card>
               <Card className="p-0 border-2 mb-6">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 leading-0">
            <Database className="text-primary size-5" />
            <h3 className="">Data & Storage</h3>
          </div>
          <p className="text-muted-foreground">
         Database and storage configuration
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
<div className="grid sm:grid-cols-2 gap-4 mb-4">
  <Card className="p-0 border-border ">
    <CardContent className="p-4">
<h3 className="text-sm text-muted-foreground mb-1">Database Size</h3>
<p className="text-2xl font-bold">2.4 GB</p>
    </CardContent>
</Card>
<Card className="p-0 border-border ">
    <CardContent className="p-4">
<h3 className="text-sm text-muted-foreground mb-1">File Storage</h3>
<p className="text-2xl font-bold">2.4 GB</p>
    </CardContent>
</Card>
</div>

       <Separator className="mb-4" />

          
    <Field className=" gap-2 mb-4 ">
      <FieldLabel htmlFor="Data Retention Period">Data Retention Period</FieldLabel>
     <div className="flex items-center gap-2">
       <Input id="Data Retention Period" className="w-24" type="number" />
      <span className="text-sm text-muted-foreground">days</span>
     </div>
      <FieldDescription className="text-xs">
How long to retain deleted user data before permanent removal
      </FieldDescription>
    </Field>
<Button variant="outline">
  <Database className="size-4 mr-2"/>
  Backup Database Now
</Button>
        </CardContent>
      </Card>
             <Card className="p-0 border-2 mb-6 border-destructive/20 bg-destructive/5">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 leading-0">
            <CircleAlert className="text-destructive size-5" />
            <h3 className="">Maintenance Mode</h3>
          </div>
          <p className="text-muted-foreground">
          Take the platform offline for maintenance
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
       
       <Field orientation="horizontal" className="gap-0  justify-between py-3 ">
      <FieldContent className="gap-0.5">
        <FieldLabel htmlFor="Maintenance Mode" className="leading-none">
    Enable Maintenance Mode
        </FieldLabel>
        <FieldDescription className="text-sm text-muted-foreground">
    Display maintenance page to all users
        </FieldDescription>
      </FieldContent>
      <Switch   checked={maintenanceMode}
          onCheckedChange={setMaintenanceMode}  id="Maintenance Mode" />
    </Field>
           
               {maintenanceMode && 
           <Card className="p-0 bg-destructive/10 border border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CircleAlert className="size-5 text-destructive  mt-0.5"/>
                <div>
                  <h4 className="font-semibold text-destructive">Platform is in maintenance mode</h4>
                  <p className="text-sm text-muted-foreground mt-1">Users will see a maintenance message and cannot access the platform</p>
                </div>
              </div>
            </CardContent>
           </Card>
   
               }
        </CardContent>
      </Card>
           <div className="flex items-center gap-3 pt-4 border-t">
            <Button className="h-10 py-0 px-6 has-[>svg]:px-4">
              <Save className="size-4"/>
              Save All Changes
            </Button>
            <Button variant="outline" className="h-10 py-0 px-6" >Reset to Defaults</Button>
           </div>
    </div>
  );
}
