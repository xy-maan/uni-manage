import React from 'react'
import { Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
export default function TasksDashboardStudent() {
  return (
                 <div className="">
                <Card className=" p-0 gap-0 border-l-4 border-l-warning">

                  <CardContent className="p-4 pb-6 ">
<div className="flex items-start justify-between mb-3 p-0">       
     <h4 className=" flex-1 pr-2">
                      Complete Database Schema Design
                    </h4>
                    <Badge className="bg-destructive/10 text-destructive">
                      High
                    </Badge></div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      Design and implement the database structure for user
                      management
                    </p>
                    <div className="flex items-start justify-between  p-0 text-sm text-foreground/70">
                      <div className="gap-4 flex items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4"/>
                          <span>Feb 2</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="size-4" />
                          <span>2</span>
                        </div>
                      </div>
                      <Badge className="bg-muted flex size-6 items-center justify-center rounded-full text-xs text-foreground/70">
                        A
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
        
         
  )
}
