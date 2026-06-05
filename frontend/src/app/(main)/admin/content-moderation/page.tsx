import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  CircleAlert,
  ArrowLeft,
  CircleCheck,
  CircleX,
  Search,
  Mail,
  Eye,
  GraduationCap,
  FolderOpen,
  TrendingUp,
  Flag,
  Funnel,
  Users,
  TriangleAlert,
  MessageSquare,
  User
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export default function ContentModeration
() {
  return (
    <div className='p-4 lg:p-8 '>
      <div className=" bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mb-6">
<div className="flex items-center gap-3">
<Link href="/admin/dashboard">
  <Button variant="outline"><ArrowLeft className='size-4'/> Back</Button></Link>
  <div className="flex items-center gap-3">
<div className="size-12 rounded-xl bg-gradient-to-br from-destructive/20 to-warning/20 flex items-center justify-center">
<Flag className='size-6 text-destructive'/>
</div>
<div className="">
  <h3 className='text-2xl lg:text-3xl font-bold'>Content Moderation
</h3>
<p className="text-sm text-muted-foreground">Review and manage reported content across the platform</p>
</div>
  </div>
</div>
</div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">  <Flag className="size-5 text-primary" /></div>
            <div className="">
              <p className="text-2xl font-bold ">40</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-0 border-2 border-destructive/20">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
              <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center">  <TriangleAlert className="size-5 text-destructive" /></div>
            <div >
              <p className="text-2xl font-bold ">5</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
           
          </CardContent>
        </Card>
          <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
              <div className="size-10 rounded-lg bg-warning/10 flex items-center justify-center">  <Eye className="size-5 text-warning" /></div>
            <div className="">
              <p className="text-2xl font-bold ">10</p>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </div>
           
          </CardContent>
        </Card>
        
          <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
              <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center">  <CircleCheck className="size-5 text-success" /></div>
            <div className="">
              <p className="text-2xl font-bold ">34</p>
              <p className="text-xs text-muted-foreground">Resolved
</p>
            </div>
           
          </CardContent>
        </Card>
      </div>
<Card className="p-0 mb-6 ">
  <CardHeader className='p-6 pb-0'>
    <div className="flex items-center gap-2 leading-0">
      <MessageSquare className="size-5 text-primary mt-px"/>
      Report Categories
    </div>
    <p className="text-muted-foreground">Distribution of reported content by type</p>
  </CardHeader>
    <CardContent className="px-6 pb-6">
           <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-0 border-border">
          <CardContent className="p-4 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm font-medium">Harassment</p>
              <p className="text-2xl font-bold mt-1 ">40</p>
            </div>
                <Flag className="size-5 text-destructive" />
          </CardContent>
        </Card>
       <Card className="p-0 border-border">
          <CardContent className="p-4 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm font-medium">Spam</p>
              <p className="text-2xl font-bold mt-1 ">40</p>
            </div>
                <Flag className="size-5 text-warning" />
          </CardContent>
        </Card>
          <Card className="p-0 border-border">
          <CardContent className="p-4 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm font-medium">Plagiarism</p>
              <p className="text-2xl font-bold mt-1 ">40</p>
            </div>
                <Flag className="size-5 text-secondary" />
          </CardContent>
        </Card>
        
         <Card className="p-0 border-border">
          <CardContent className="p-4 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm font-medium">Inappropriate Content</p>
              <p className="text-2xl font-bold mt-1 ">40</p>
            </div>
                <Flag className="size-5 text-primary" />
          </CardContent>
        </Card>
         <Card className="p-0 border-border">
          <CardContent className="p-4 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm font-medium">Other</p>
              <p className="text-2xl font-bold mt-1 ">40</p>
            </div>
                <Flag className="size-5 text-foreground" />
          </CardContent>
        </Card>
      </div>
    </CardContent>
</Card>
       <Card className="p-0 border-2">
        <CardHeader className="p-6 pb-0  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2"><FolderOpen className='text-primary size-5'/>
          All Projects
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <Search className=" absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              </div>
                              <input
                                type="search"
                                id="search"
                                className=" border  text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  flex w-full min-w-0 rounded-md h-9 dark:bg-input/30 border-input text-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 focus:outline-none  pr-4 focus:ring-2 focus:ring-primary px-3 py-1"
                                placeholder="Search projects..."
                                required
                              />
                            </div>
                               <Button variant="outline">
                <Funnel className="size-4 mr-2" /> Filter{" "}
              </Button>
          </div>
        </CardHeader>
          <CardContent className="p-6 pt-0 ">
            <div className="overflow-x-auto">
      <Table className="">
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead>Report ID</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Category</TableHead>
      <TableHead className=''>Reported User</TableHead>
      <TableHead>Severity</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="">Timestamp</TableHead>
      <TableHead className='text-right'>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className=''>
    <TableRow>
      <TableCell className="font-mono-system text-sm">RPT-001</TableCell>
      <TableCell className=''>
        <Badge className='text-foreground bg-muted/30 border-border'>Project Description</Badge>
      </TableCell>
      <TableCell className='font-medium'>Inappropriate Content</TableCell>
<TableCell className="">
  <div className="flex gap-2 items-center">
    <User className="size-4 text-muted-foreground"/> Mark Thompson
  </div>
</TableCell>
         <TableCell className="text-sm">  <Badge className='bg-destructive/10 text-destructive border-destructive/20'>high</Badge></TableCell>
      <TableCell><Badge className='bg-destructive/10 text-destructive border-destructive/20'>pending</Badge></TableCell>
      <TableCell className='text-sm text-muted-foreground'>

          2026-02-07 10:30 AM
      </TableCell>
      <TableCell className='text-right '>
         <div className="flex items-center justify-end gap-2">
  <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent text-foreground py-0 px-3">
        <Eye className='size-4'/></Button>
        <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent  py-0 px-3 text-success">
        <CircleCheck className='size-4'/></Button>
        <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent text-destructive py-0 px-3">
        <CircleAlert className='size-4'/></Button>
         </div>
        </TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-mono-system text-sm">RPT-001</TableCell>
      <TableCell className=''>
        <Badge className='text-foreground bg-muted/30 border-border'>Project Description</Badge>
      </TableCell>
      <TableCell className='font-medium'>Inappropriate Content</TableCell>
<TableCell className="">
  <div className="flex gap-2 items-center">
    <User className="size-4 text-muted-foreground"/> Mark Thompson
  </div>
</TableCell>
         <TableCell className="text-sm">  <Badge className='bg-destructive/10 text-destructive border-destructive/20'>high</Badge></TableCell>
      <TableCell><Badge className='bg-destructive/10 text-destructive border-destructive/20'>pending</Badge></TableCell>
      <TableCell className='text-sm text-muted-foreground'>

          2026-02-07 10:30 AM
      </TableCell>
      <TableCell className='text-right '>
         <div className="flex items-center justify-end gap-2">
  <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent text-foreground py-0 px-3">
        <Eye className='size-4'/></Button>
        <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent  py-0 px-3 text-success">
        <CircleCheck className='size-4'/></Button>
        <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent text-destructive py-0 px-3">
        <CircleAlert className='size-4'/></Button>
         </div>
        </TableCell>
    </TableRow>
  </TableBody>
</Table>

            </div>
          </CardContent>
        </Card>

    </div>
  )
}
