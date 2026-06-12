import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/navigation';
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  GraduationCap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function SupervisorVerification() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="border-b bg-background/95 backdrop-blur  sticky top-0 z-10 supports-backdrop-filter:bg-background/60 ">
        <div className=" px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="size-4" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <UserCheck className="size-6 text-secondary" />
              </div>
              <div className="">
                <h1 className="text-2xl font-bold">
                  Supervisor Role Verification
                </h1>
                <p className="text-sm text-muted-foreground">
                  Review and approve supervisor applications
                </p>
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
                <h4 className="text-sm text-muted-foreground">
                  Total Requests
                </h4>
                <span className="text-2xl font-bold">10</span>
              </div>
              <UserCheck className="size-8 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="p-0 border-2 border-success/20">
            <CardContent className="p-6 pb-6 justify-between flex items-center">
              <div className="">
                <h4 className="text-sm text-muted-foreground">
                  Pending Review
                </h4>
                <span className="text-2xl font-bold text-success">6</span>
              </div>
              <CircleCheck className="size-8 text-success" />
            </CardContent>
          </Card>
          <Card className="p-0 border-2 border-warning/20">
            <CardContent className="p-6 pb-6 justify-between flex items-center">
              <div className="">
                <h4 className="text-sm text-muted-foreground">Verified</h4>
                <span className="text-2xl font-bold text-warning">6</span>
              </div>
              <CircleAlert className="size-8 text-warning" />
            </CardContent>
          </Card>
          <Card className="p-0 border-2 border-destructive/20">
            <CardContent className="p-6 pb-6 justify-between flex items-center">
              <div className="">
                <h4 className="text-sm text-muted-foreground">Rejected</h4>
                <span className="text-2xl font-bold text-destructive">6</span>
              </div>
              <CircleX className="size-8 text-destructive" />
            </CardContent>
          </Card>
        </div>
        <Card className="p-0 mb-6">
          <CardContent className="p-6 ">
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
                <Select>
                  <SelectTrigger className="px-4 py-2  [&_svg]:mt-1 bg-background dark:bg-background h-auto! text-foreground! text-md ">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bottom-1/2">
                    <SelectGroup>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Assistant">Assistant</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="px-4   [&_svg]:mt-1  bg-background dark:bg-background h-auto! text-foreground! text-md">
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


            <Card className="p-0 mb-4 border-2 hover:border-primary/30 transition-all">
              <CardContent className="p-6 ">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-white font-semibold">
                          D
                        </div>
                        <div className="">
                          <div className="mb-1 flex items-center gap-2 ">
                            <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                            <Badge variant="outline" >
                              Primary Supervisor
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="size-3" />
                            sarah.johnson@university.edu
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <GraduationCap className="size-3" />
                            Tech University • Computer Science
                          </div>
                        </div>
                      </div>
                      <Badge className="text-warning bg-warning/10 border-warning/20">
                        Pending Review
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/30 mb-4">
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          PhD
                        </span>
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <CircleCheck className="text-success size-3" />
                          Yes
                        </div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Experience
                        </span>
                        <div className="font-semibold text-sm ">12 years</div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Publications
                        </span>
                        <div className="font-semibold text-sm ">45</div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Projects
                        </span>
                        <div className="font-semibold text-sm ">45</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <FileText className="size-4" />
                        Submitted Documents
                      </h3>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          PhD Certificate - Computer Science
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          Employment Letter - Tech University
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          Academic CV
                        </li>
                      </ul>
                    </div>
                    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-sm">
                              <span className="font-medium">Reason: </span>
                             Experienced faculty member specializing in AI and Machine Learning
                      </div>
                    </div>
                  <span className="text-xs text-muted-foreground">Requested: 2024-02-05</span>
                  </div>
                  <div className="flex flex-col gap-2 items-center lg:w-48  w-full">
                    <Button className=" bg-success text-white hover:bg-success/90 w-full">
                      {" "}
                      <CircleCheck className="size-4 mr-1" /> Approve as Primary
                    </Button>
                    <Button className=" hover:text-accent-foreground bg-destructive text-destructive hover:bg-destructive/90 w-full dark:bg-input/30">
                      {" "}
                      <CircleX className="size-4 mr-1" />
                      Reject
                    </Button>
                    <Button className=" hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 w-full">
                      {" "}
                      <Eye className="size-4 mr-1" />
                      View Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
         <Card className="p-0 mb-4 border-2 hover:border-primary/30 transition-all">
              <CardContent className="p-6 ">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-white font-semibold">
                          D
                        </div>
                        <div className="">
                          <div className="mb-1 flex items-center gap-2 ">
                            <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                            <Badge variant="outline">
                              Primary Supervisor
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="size-3" />
                            sarah.johnson@university.edu
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <GraduationCap className="size-3" />
                            Tech University • Computer Science
                          </div>
                        </div>
                      </div>
                      <Badge className="text-success bg-success/10 border-success/20">
                      Verified
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/30 mb-4">
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          PhD
                        </span>
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <CircleCheck className="text-success size-3" />
                          Yes
                        </div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Experience
                        </span>
                        <div className="font-semibold text-sm ">12 years</div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Publications
                        </span>
                        <div className="font-semibold text-sm ">45</div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Projects
                        </span>
                        <div className="font-semibold text-sm ">45</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <FileText className="size-4" />
                        Submitted Documents
                      </h3>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          PhD Certificate - Computer Science
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          Employment Letter - Tech University
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          Academic CV
                        </li>
                      </ul>
                    </div>
                    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-sm">
                              <span className="font-medium">Reason: </span>
                            Full Professor with extensive research background
                      </div>
                    </div>
                  <span className="text-xs text-muted-foreground">Requested: 2024-02-05</span>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48 w-full">

                    <Button className=" hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50   w-full">
                      {" "}
                      <Eye className="size-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

                 <Card className="p-0 mb-4 border-2 hover:border-primary/30 transition-all">
              <CardContent className="p-6 ">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-white font-semibold">
                          D
                        </div>
                        <div className="">
                          <div className="mb-1 flex items-center gap-2 ">
                            <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                            <Badge variant="outline">
                              Primary Supervisor
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="size-3" />
                            sarah.johnson@university.edu
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <GraduationCap className="size-3" />
                            Tech University • Computer Science
                          </div>
                        </div>
                      </div>
                      <Badge className="text-destructive bg-destructive/10 border-destructive/20">
                      Rejected
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/30 mb-4">
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          PhD
                        </span>
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <CircleCheck className="text-destructive size-3" />
                          Yes
                        </div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Experience
                        </span>
                        <div className="font-semibold text-sm ">12 years</div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Publications
                        </span>
                        <div className="font-semibold text-sm ">45</div>
                      </div>
                      <div className="">
                        <span className="text-xs text-muted-foreground">
                          Projects
                        </span>
                        <div className="font-semibold text-sm ">45</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <FileText className="size-4" />
                        Submitted Documents
                      </h3>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleCheck className="size-3 text-success" />
                          Bachelor's Degree
                        </li>
                      
                      </ul>
                    </div>
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="text-sm text-destructive">
                              <span className="font-medium">Rejection Reason: </span>
                            Full Professor with extensive research background
                      </div>
                    </div>
                  <span className="text-xs text-muted-foreground">Requested: 2024-02-05</span>
                  </div>

           <div className="flex flex-col gap-2 lg:w-48 w-full">

                    <Button className=" hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 w-full">
                      
                      <Eye className="size-4 mr-1" />
                      Review Again
                    </Button>
           </div>
                </div>
              </CardContent>
            </Card>
      </div>
    </div>
  );
}
