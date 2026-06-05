import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardAdmin() {
  return (
    <div className="p-4 lg:p-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-0 border-2">
          <CardContent className="p-6 ">
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="size-6 text-primary" />
              </div>
              <Badge className="bg-success/10 border-success/20 text-success">
                +12%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">1,151</h3>
            <p className="text-sm font-medium text-foreground/80">
              Total Users
            </p>
          </CardContent>
        </Card>
        <Card className="p-0 border-2">
          <CardContent className="p-6 ">
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <FolderOpen className="size-6 text-secondary" />
              </div>
              <Badge className="bg-success/10 border-success/20 text-success">
                +12%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">1,151</h3>
            <p className="text-sm font-medium text-foreground/80">
              Total Users
            </p>
          </CardContent>
        </Card>
        <Card className="p-0 border-2">
          <CardContent className="p-6 ">
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <UserCheck className="size-6 text-warning" />
              </div>
              <Badge className="bg-primary/10 border-primary/20 text-primary">
                +12%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">1,151</h3>
            <p className="text-sm font-medium text-foreground/80">
              Total Users
            </p>
          </CardContent>
        </Card>
        <Card className="p-0 border-2">
          <CardContent className="p-6 ">
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <CircleAlert className="size-6 text-destructive" />
              </div>
              <Badge className="bg-success/10 border-success/20 text-success">
                +12%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">1,151</h3>
            <p className="text-sm font-medium text-foreground/80">
              Total Users
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mb-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-0 mb-6">
            <CardHeader className="p-6 pb-0 gap-2 flex items-center leading-none">
              <Users className="text-primary size-5" />
              <h4 className="text-md font-normal">User Distribution</h4>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="mb-4">
                <Field className="w-full gap-2">
                  <FieldLabel
                    htmlFor="progress-upload"
                    className=" text-sm font-normal flex items-center justify-between "
                  >
                    <span className="font-medium">Students</span>
                    <span className="text-muted-foreground">1,523</span>
                  </FieldLabel>
                  <Progress
                    value={82}
                    id="progress-upload"
                    className="bg-primary/20   [&_[data-slot=progress-indicator]]:bg-primary! [&_[data-slot=progress-indicator]]:bg-none!"
                  />
                </Field>
                <span className="text-xs text-muted-foreground">
                  82% of total users
                </span>
              </div>
              <div className="mb-4">
                <Field className="w-full gap-2">
                  <FieldLabel
                    htmlFor="progress-upload"
                    className=" text-sm font-normal flex items-center justify-between "
                  >
                    <span className="font-medium">Supervisors</span>
                    <span className="text-muted-foreground">276</span>
                  </FieldLabel>
                  <Progress
                    value={15}
                    id="progress-upload"
                    className="bg-primary/20   [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
                  />
                </Field>
                <span className="text-xs text-muted-foreground">
                  15% of total users
                </span>
              </div>
              <div className="">
                <Field className="w-full gap-2">
                  <FieldLabel
                    htmlFor="progress-upload"
                    className=" text-sm font-normal flex items-center justify-between "
                  >
                    <span className="font-medium">Organizations</span>
                    <span className="text-muted-foreground">48</span>
                  </FieldLabel>
                  <Progress
                    value={3}
                    id="progress-upload"
                    className="bg-primary/20   [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
                  />
                </Field>
                <span className="text-xs text-muted-foreground">
                  3% of total users
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0 border-success/20 bg-success/5 border-2">
            <CardHeader className="p-6 pb-0 gap-2 flex items-center leading-none">
              <Activity className="text-success size-5" />
              <h4 className="text-md font-normal">System Health</h4>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="mb-4 text-center">
                <h3 className="text-5xl font-bold text-success mb-2">98%</h3>
                <p className="text-sm text-muted-foreground">
                  All systems operational
                </p>
              </div>
              <div className="">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Server Uptime</span>
                  <span className="text-success font-medium">99.9%</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Response Time</span>
                  <span className="text-success font-medium">124ms</span>
                </div>
                <div className="flex items-center justify-between text-sm ">
                  <span>Active Sessions</span>
                  <span className="text-success font-medium">342</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="p-0 border-border ">
            <CardHeader className="flex items-center justify-between p-6 pb-0">
              <div className="">
                <div className="flex items-center gap-2 leading-none">
                  <Clock className="size-5 text-primary" />
                  <h4 className="">Recent Activity</h4>
                </div>
                <p className="text-muted-foreground">
                  Latest platform events and actions
                </p>
              </div>
              <Button variant="outline">
                <Funnel className="size-4 mr-2" /> Filter{" "}
              </Button>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Card className="p-0 mb-4  hover:bg-muted/30">
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                      <UserCheck className="size-5 text-primary" />
                    </div>
                    <div className="">
                      <h4 className="font-medium text-sm">
                        Supervisor account verified
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Dr. Abdulrahman
                      </p>
                      <span className="text-xs text-muted-foreground mt-1">
                        5 minutes ago
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    approved
                  </Badge>
                </CardContent>
              </Card>
              <Card className="p-0 mb-4  hover:bg-muted/30">
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary/10">
                      <FolderOpen className="size-5 text-secondary" />
                    </div>
                    <div className="">
                      <h4 className="font-medium text-sm">
                        New project created
                      </h4>
                      <p className="text-sm text-muted-foreground">Abdullah</p>
                      <span className="text-xs text-muted-foreground mt-1">
                        5 minutes ago
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    active
                  </Badge>
                </CardContent>
              </Card>
              <Card className="p-0   hover:bg-muted/30">
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-destructive/10">
                      <CircleAlert className="size-5 text-destructive" />
                    </div>
                    <div className="">
                      <h4 className="font-medium text-sm">
                        Content reported for review
                      </h4>
                      <p className="text-sm text-muted-foreground">System</p>
                      <span className="text-xs text-muted-foreground mt-1">
                        5 minutes ago
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    pending
                  </Badge>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users">
          <Card className="p-0 border-2 transition-all cursor-pointer hover:border-primary/50  ">
            <CardContent className="p-6 text-center">
              <Users className="size-8 mb-3 mx-auto text-primary" />
              <h3 className="font-semibold mb-1">User Management</h3>
              <p className="text-sm text-muted-foreground">
                View and manage all users
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/supervisor-verification">
          <Card className="p-0 border-2 transition-all cursor-pointer hover:border-secondary/50  ">
            <CardContent className="p-6 text-center">
              <UserCheck className="size-8 mb-3 mx-auto text-secondary" />
              <h3 className="font-semibold mb-1">Supervisor Verification</h3>
              <p className="text-sm text-muted-foreground">
                23 pending approvals
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/domain-validation">
          <Card className="p-0 border-2 transition-all cursor-pointer hover:border-warning/50  ">
            <CardContent className="p-6 text-center">
              <Shield className="size-8 mb-3 mx-auto text-warning" />
              <h3 className="font-semibold mb-1">Domain Validation</h3>
              <p className="text-sm text-muted-foreground">
                University email verification
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/audit-logs">
          {" "}
          <Card className="p-0 border-2 transition-all cursor-pointer hover:border-destructive/50 ">
            <CardContent className="p-6 text-center">
              <FileText className="size-8 mb-3 mx-auto text-destructive" />
              <h3 className="font-semibold mb-1">Audit Logs</h3>
              <p className="text-sm text-muted-foreground">
                System activity history
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
