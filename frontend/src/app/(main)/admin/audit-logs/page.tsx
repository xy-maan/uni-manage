"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  CircleAlert,
  ArrowLeft,
  Search,
  Mail,
  Eye,
  Flag,
  User,
  FileText,
  Calendar,
  Shield,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuditLogs() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="p-4 lg:p-8 ">
      <div className=" bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="outline">
              <ArrowLeft className="size-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-gradient-to-br from-destructive/20 to-warning/20 flex items-center justify-center">
              <Flag className="size-6 text-destructive" />
            </div>
            <div className="">
              <h3 className="text-2xl lg:text-3xl font-bold">
                Content Moderation
              </h3>
              <p className="text-sm text-muted-foreground">
                Review and manage reported content across the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-0 border-2 border-border">
          <CardContent className="p-4 pb-6 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold ">40</p>
            </div>

            <FileText className="size-8  text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="p-0 border-2 border-primary/20">
          <CardContent className="p-4 pb-6 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-primary ">40</p>
            </div>

            <Calendar className="size-8  text-primary" />
          </CardContent>
        </Card>
        <Card className="p-0 border-2 border-warning/20">
          <CardContent className="p-4 pb-6 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-warning ">2</p>
            </div>

            <CircleAlert className="size-8  text-warning" />
          </CardContent>
        </Card>
        <Card className="p-0 border-2 border-destructive/20">
          <CardContent className="p-4 pb-6 gap-3 flex items-center justify-between">
            <div className="">
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-destructive ">2</p>
            </div>

            <Shield className="size-8  text-destructive" />
          </CardContent>
        </Card>
      </div>
      <Card className="p-0 mb-6 ">
        <CardContent className="p-6">
          <Field className="mb-4  gap-2">
            <InputGroup className="dark:bg-background h-11">
              <InputGroupInput
                className=" py-2 h-full"
                placeholder="Search logs by action, user, or target..."
              />
              <InputGroupAddon align="inline-start" className="pr-1 py-2">
                <Search className="" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={() => setActiveTab("all")}
              variant={activeTab === "all" ? "default" : "outline"}
              className="py-0 px-3 gap-1.5 h-8 border"
            >
              <FileText className="size-4 mr-1" /> All Activities
            </Button>
            <Button
              onClick={() => setActiveTab("user")}
              variant={activeTab === "user" ? "default" : "outline"}
              className="py-0 px-3 gap-1.5 h-8 border"
            >
              <User className="size-4 mr-1" /> User Management
            </Button>
            <Button
              onClick={() => setActiveTab("domain")}
              variant={activeTab === "domain" ? "default" : "outline"}
              className="py-0 px-3 gap-1.5 h-8 border"
            >
              <Shield className="size-4 mr-1" /> Domain Validation
            </Button>
            <Button
              onClick={() => setActiveTab("content")}
              variant={activeTab === "content" ? "default" : "outline"}
              className="py-0 px-3 gap-1.5 h-8 border"
            >
              <Eye className="size-4 mr-1" /> Content Moderation
            </Button>
            <Button
              onClick={() => setActiveTab("system")}
              variant={activeTab === "system" ? "default" : "outline"}
              className="py-0 px-3 gap-1.5 h-8 border"
            >
              <Settings className="size-4 mr-1" /> System Config
            </Button>
          </div>
          <Select>
            <SelectTrigger className="px-4 py-2  [&_svg]:mt-1 bg-background dark:bg-background h-auto! text-foreground! text-md ">
              <SelectValue placeholder="Last 24 Hours" />
            </SelectTrigger>
            <SelectContent className="bottom-1/2">
              <SelectGroup>
                <SelectItem value="all">Last 24 Hours</SelectItem>
                <SelectItem value="Students">Last 7 Days</SelectItem>
                <SelectItem value="Supervisor">Last 30 Days</SelectItem>
                <SelectItem value="Supervisor">Last 90 Days</SelectItem>
                <SelectItem value="Supervisor">Custom Range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card className="p-0 border-2">
        <CardHeader className="p-6 pb-0">Activity Log (10 entries)</CardHeader>
        <CardContent className="p-6 pt-0  ">
          <Card className="p-0 mb-2 hover:bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex  items-start lg:justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-2">
                    <div className="">
                      <div className="flex gap-2 items-center mb-1">
                        <h3 className="font-semibold">User Verified</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Info
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex lg:flex-row flex-col  lg:items-center gap-2">
                        <p>Admin (admin@unimanage.com) → Dr. Sarah Johnson</p>
                        <Badge className=" text-xs lg:ml-1 text-foreground bg-muted/30 border-border">
                          Supervisor
                        </Badge>
                      </div>
                    </div>
                    <div className="lg:text-right text-xs text-muted-foreground">
                      <p>2024-02-14 10:32:15</p>
                      <p className="mt-1">IP: 192.168.1.100</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 text-sm">
                    <span className="">Approved Primary Supervisor role</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className=" text-xs text-foreground bg-muted/30 border-border">
                      user management
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0 mb-2 hover:bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                  <Shield className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex  items-start lg:justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-2">
                    <div className="">
                      <div className="flex gap-2 items-center mb-1">
                        <h3 className="font-semibold">Bulk Import</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Info
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex lg:flex-row flex-col lg:items-center gap-2">
                        <p>Admin (admin@unimanage.com) → Dr. Sarah Johnson</p>
                        <Badge className=" text-xs lg:ml-1 text-foreground bg-muted/30 border-border">
                          System
                        </Badge>
                      </div>
                    </div>
                    <div className=" lg:text-right text-xs text-muted-foreground">
                      <p>2024-02-14 10:32:15</p>
                      <p className="mt-1">IP: 192.168.1.100</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 text-sm">
                    <span className="">Approved Primary Supervisor role</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className=" text-xs text-foreground bg-muted/30 border-border">
                      user management
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0 mb-2 border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-warning/10">
                  <Eye className="size-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="flex  items-start lg:justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-2">
                    <div className="">
                      <div className="flex gap-2 items-center mb-1">
                        <h3 className="font-semibold">Project Moderated</h3>
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          Warning
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground lg:flex-row flex-col flex lg:items-center gap-2">
                        <p>Admin (admin@unimanage.com) → Dr. Sarah Johnson</p>
                        <Badge className=" text-xs lg:ml-1 text-foreground bg-muted/30 border-border">
                          Project
                        </Badge>
                      </div>
                    </div>
                    <div className=" lg:text-right text-xs text-muted-foreground">
                      <p>2024-02-14 10:32:15</p>
                      <p className="mt-1">IP: 192.168.1.100</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 text-sm">
                    <span className="">Approved Primary Supervisor role</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className=" text-xs text-foreground bg-muted/30 border-border">
                      content moderation
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0 mb-2 hover:bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                  <Settings className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex  items-start lg:justify-between lg:flex-row flex-col gap-3 lg:gap-0 mb-2">
                    <div className="">
                      <div className="flex gap-2 items-center mb-1">
                        <h3 className="font-semibold">Settings Updated</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Info
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground lg:flex-row flex-col flex lg:items-center gap-2">
                        <p>Admin (admin@unimanage.com) → Dr. Sarah Johnson</p>
                        <Badge className=" text-xs lg:ml-1 text-foreground bg-muted/30 border-border">
                          System
                        </Badge>
                      </div>
                    </div>
                    <div className=" lg:text-right text-xs text-muted-foreground">
                      <p>2024-02-14 10:32:15</p>
                      <p className="mt-1">IP: 192.168.1.100</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 text-sm">
                    <span className="">Approved Primary Supervisor role</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className=" text-xs text-foreground bg-muted/30 border-border">
                      user management
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
