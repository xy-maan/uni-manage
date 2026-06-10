import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation';
import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  CircleAlert,
  Clock,
  FileText,
  FolderOpen,
  Funnel,
  Shield,
  UserCheck,
  Users,
  ArrowLeft,
  CircleCheck,
  CircleX,
  Search,
  Mail,
  Eye,
  GraduationCap
} from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export default function UsersAdmin() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5'>
<div className="border-b bg-background/95 backdrop-blur  sticky top-0 z-10 supports-backdrop-filter:bg-background/60 ">
<div className=" px-4 lg:px-8 py-4">

<div className="flex items-center gap-3">
<Link href="/admin/dashboard">
  <Button variant="outline"><ArrowLeft className='size-4'/> Back</Button></Link>
  <div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
<Users className='size-6 text-primary'/>
</div>
<div className="">
  <h3 className='text-2xl font-bold'>User Management
</h3>
<p className="text-sm text-muted-foreground">Manage all platform users and permissions</p>
</div>
  </div>
</div>
</div>
</div>

<div className="px-4 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-0 border-2">
          <CardContent className="p-4 pb-6 justify-between flex items-center">
            <div className="">
              <h4 className="text-sm text-muted-foreground">Total Users</h4>
              <span className="text-2xl font-bold">10</span>
            </div>
                <Users className="size-8 text-muted-foreground" />
           
          </CardContent>
        </Card>
   <Card className="p-0 border-2 border-success/20">
          <CardContent className="p-6 pb-6 justify-between flex items-center">
            <div className="">
              <h4 className="text-sm text-muted-foreground">Verified</h4>
              <span className="text-2xl font-bold text-success">6</span>
            </div>
                <CircleCheck className="size-8 text-success" />
           
          </CardContent>
        </Card>
        <Card className="p-0 border-2 border-warning/20">
          <CardContent className="p-6 pb-6 justify-between flex items-center">
            <div className="">
              <h4 className="text-sm text-muted-foreground">Pending</h4>
              <span className="text-2xl font-bold text-warning">6</span>
            </div>
                <CircleAlert className="size-8 text-warning" />
           
          </CardContent>
        </Card>
             <Card className="p-0 border-2 border-destructive/20">
          <CardContent className="p-6 pb-6 justify-between flex items-center">
            <div className="">
              <h4 className="text-sm text-muted-foreground">Flagged</h4>
              <span className="text-2xl font-bold text-destructive">0</span>
            </div>
                <CircleX className="size-8 text-destructive" />
           
          </CardContent>
        </Card>
      </div>
      <Card className="p-0 mb-6">
<CardContent className='p-6 '>
<div className="flex flex-col md:flex-row gap-4">
     <div className=" flex-1">
           <div className="relative ">
               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className=" absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
              <input
                type="search"
                id="search"
                className=" border  text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  flex w-full min-w-0 rounded-md  px-3 text-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background pl-10 focus:outline-none border-border  pr-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="Search by name or email..."
                required
              />
            </div>
           </div>
            <div className="flex gap-2 ">
                <Select >
            <SelectTrigger className='px-4 py-2  [&_svg]:mt-1 bg-background dark:bg-background h-auto! text-foreground! text-md '>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bottom-1/2">
              <SelectGroup>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Students">Students</SelectItem>
            <SelectItem value="Supervisor">Supervisor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
       <Select>
            <SelectTrigger  className='px-4   [&_svg]:mt-1  bg-background dark:bg-background h-auto! text-foreground! text-md'>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="top-1/2 -translate-y-1/2">
              <SelectGroup>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Flagged">Flagged</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

            </div>
</div>
</CardContent>
      </Card>

      <Card className="p-0 ">
  <CardHeader className="p-6 pb-0">
    Users (8)
  </CardHeader>
    <CardContent className="px-6 pb-6">
<Card className="p-0 mb-2 ">
    <CardContent className="p-4  hover:bg-muted/30 transition-colors">
<div className="flex items-start lg:items-center lg:justify-between lg:flex-row gap-4 lg:gap-0 flex-col">

<div className="flex items-center gap-4">
<div className="relative">
  <div className="size-12 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-white font-semibold">
  D
  </div>
  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-secondary/10 border-2 border-background flex items-center justify-center">
  <UserCheck className='size-3 text-secondary'/>
  </div>
</div>
<div className="">
  <div className="mb-1 flex items-center gap-2 ">
    <h3 className="font-semibold">Dr. Abdulrahman</h3>
    <Badge className='text-foreground bg-transparent border-border'>Primary Supervisor
</Badge>
  </div>
  <div className="text-sm text-muted-foreground flex items-center gap-2">
    <Mail className='size-3'/>
    abdulrahman@fayoum.edu.eg

</div>
</div>
</div>

<div className="flex gap-4 items-center ">

  <div className="gap-1 flex flex-col ">
    <p className="text-sm font-medium">12 projects</p>
    <span className="text-xs text-muted-foreground">Computer Science</span>
  </div>
<Badge className='text-success bg-success/10 border-success/20'>Verified</Badge>
<Button className='hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent'> <Eye className='size-4 mr-1'/> View</Button>
</div>

</div>
    </CardContent>
</Card>
<Card className="p-0 mb-2 ">
    <CardContent className="p-4  hover:bg-muted/30 transition-colors">
<div className="flex items-start lg:items-center lg:justify-between lg:flex-row gap-4 lg:gap-0 flex-col">

<div className="flex items-center gap-4">
<div className="relative">
  <div className="size-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
  D
  </div>
  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
  <GraduationCap className='size-3 text-primary'/>
  </div>
</div>
<div className="">
  <div className="mb-1 flex items-center gap-2 ">
    <h3 className="font-semibold">Abdullah</h3>

  </div>
  <div className="text-sm text-muted-foreground flex items-center gap-2">
    <Mail className='size-3'/>
    Abdullah@fayoum.edu.eg

</div>
</div>
</div>

<div className="flex gap-4 items-center ">

  <div className="gap-1 flex flex-col ">
    <p className="text-sm font-medium">12 projects</p>
    <span className="text-xs text-muted-foreground">Computer Science</span>
  </div>
<Badge className='text-success bg-success/10 border-success/20'>Verified</Badge>
<Button className='hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent'> <Eye className='size-4 mr-1'/> View</Button>
</div>

</div>
    </CardContent>
</Card>
<Card className="p-0 mb-2 ">
    <CardContent className="p-4  hover:bg-muted/30 transition-colors">
<div className="flex items-start lg:items-center lg:justify-between lg:flex-row gap-4 lg:gap-0 flex-col">

<div className="flex items-center gap-4">
<div className="relative">
  <div className="size-12 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-white font-semibold">
  D
  </div>
  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-secondary/10 border-2 border-background flex items-center justify-center">
  <UserCheck className='size-3 text-secondary'/>
  </div>
</div>
<div className="">
  <div className="mb-1 flex items-center gap-2 ">
    <h3 className="font-semibold">Dr. Abdulrahman</h3>
    <Badge className='text-foreground bg-transparent border-border'>Primary Supervisor
</Badge>
  </div>
  <div className="text-sm text-muted-foreground flex items-center gap-2">
    <Mail className='size-3'/>
    abdulrahman@fayoum.edu.eg

</div>
</div>
</div>

<div className="flex gap-4 items-center ">

  <div className="gap-1 flex flex-col ">
    <p className="text-sm font-medium">0 projects</p>
    <span className="text-xs text-muted-foreground">Software Engineering</span>
  </div>
<Badge className='text-warning bg-warning/10 border-warning/20'>Pending</Badge>
<div className="flex items-center gap-2">
  <Button className="hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50  bg-success/10 text-success hover:bg-success/20">
  <CircleCheck className="size-4 mr-1"/>
  Approve
  </Button>
   <Button className="hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50  bg-destructive/10 text-destructive hover:bg-destructive/20">
  <CircleX className="size-4 mr-1"/>
  Reject
  </Button>
</div>
</div>

</div>
    </CardContent>
</Card>
    </CardContent>
</Card>
</div>

    </div>
  )
}
