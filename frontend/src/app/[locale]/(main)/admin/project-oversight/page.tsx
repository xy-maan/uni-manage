import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/navigation';
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
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
export default function ProjectOversight() {
  return (
    <div className="p-4 lg:p-8 ">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {" "}
              <FolderOpen className="size-5 text-primary" />
            </div>
            <div className="">
              <p className="text-2xl font-bold ">892</p>
              <p className="text-xs text-muted-foreground">Total Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
            <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center">
              {" "}
              <CircleCheck className="size-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold ">892</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
            <div className="size-10 rounded-lg bg-warning/10 flex items-center justify-center">
              {" "}
              <Eye className="size-5 text-warning" />
            </div>
            <div className="">
              <p className="text-2xl font-bold ">892</p>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 border-2">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
            <div className="size-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              {" "}
              <TrendingUp className="size-5 text-secondary" />
            </div>
            <div className="">
              <p className="text-2xl font-bold ">892</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 border-2 border-destructive/20">
          <CardContent className="p-6 gap-3 mb-2 flex items-center">
            <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              {" "}
              <Flag className="size-5 text-destructive" />
            </div>
            <div className="">
              <p className="text-2xl font-bold ">892</p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-0 border-2">
        <CardHeader className="p-6 pb-0  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-primary size-5" />
            All Projects
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Field className="gap-2 sm:flex-initial sm:w-64">
              <InputGroup className=" ">
                <InputGroupInput placeholder="Search projects..." />
                <InputGroupAddon align="inline-start">
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </Field>
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
                  <TableHead>Project ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                <TableRow>
                  <TableCell className="font-mono-system text-sm">
                    PRJ-2024-001
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    AI-Powered Learning Platform
                  </TableCell>
                  <TableCell>Team Alpha</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 items-center justify-center">
                      <Users className="size-4 text-muted-foreground" /> 3
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">Dr. Sarah Johnson</TableCell>
                  <TableCell>
                    <Badge className=" bg-success/10 text-success border-success/20">
                      active
                    </Badge>
                  </TableCell>
                  <TableCell className=" text-center">
                    <Field className="w-full gap-2 flex flex-row items-center">
                      <Progress
                        value={75}
                        id="progress-upload"
                        className="bg-muted  [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none "
                      />
                      <FieldLabel htmlFor="progress-upload" className="">
                        <span className="text-xs font-medium w-10 text-right">
                          75%
                        </span>
                      </FieldLabel>
                    </Field>
                  </TableCell>
                  <TableCell>
                    <Badge className=" bg-success/10 text-success border-success/20">
                      low
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right ">
                    <div className="flex items-center justify-end gap-2">
                      <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent text-foreground py-0 px-3">
                        <Eye className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono-system text-sm">
                    PRJ-2024-001
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    AI-Powered Learning Platform
                  </TableCell>
                  <TableCell>Team Alpha</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 items-center justify-center">
                      <Users className="size-4 text-muted-foreground" /> 3
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">Dr. Sarah Johnson</TableCell>
                  <TableCell>
                    <Badge className=" bg-success/10 text-success border-success/20">
                      active
                    </Badge>
                  </TableCell>
                  <TableCell className=" text-center">
                    <Field className="w-full gap-2 flex flex-row items-center">
                      <Progress
                        value={75}
                        id="progress-upload"
                        className="bg-muted  [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none "
                      />
                      <FieldLabel htmlFor="progress-upload" className="">
                        <span className="text-xs font-medium w-10 text-right">
                          75%
                        </span>
                      </FieldLabel>
                    </Field>
                  </TableCell>
                  <TableCell>
                    <Badge className=" bg-success/10 text-success border-success/20">
                      under-review
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right ">
                    <div className="flex items-center justify-end gap-2">
                      <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent text-foreground py-0 px-3">
                        <Eye className="size-4" />
                      </Button>
                      <Button className="hover:bg-accent hover:text-accent-foreground  dark:hover:bg-accent/50 bg-transparent py-0 px-3">
                        <Flag className=" text-destructive size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
