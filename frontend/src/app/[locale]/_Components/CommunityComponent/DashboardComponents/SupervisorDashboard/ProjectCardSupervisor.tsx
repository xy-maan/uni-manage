// import React from "react";
// import {
//   ArrowRight,
//   Calendar,
//   CircleAlert,
//   CircleCheck,
//   Clock,
//   Eye,
//   FileText,
//   MessageSquare,
//   TriangleAlert,
//   Users,
// } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
// import { Field, FieldLabel } from "@/components/ui/field";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// export default function ProjectCardSupervisor() {
//   return (
//     <Card className=" p-0 gap-0  border hover:border-primary/50 transition-all">
//       <CardContent className="p-6">
//       <div className="flex items-start justify-between flex-col lg:flex-row gap-6 lg:items-center">
//           <div className="flex-1">
//             <div className="mb-3">
//               <h4 className="mb-2">AI-Powered Study Assistant</h4>
//                       <Badge className="bg-success/10 text-success">
//                       <CircleCheck className="size-4 mr-1"/>
//                       On Track</Badge>
                      
//             </div>
//               <div className="flex items-center gap-4 mb-4">
//              <div className="flex items-center gap-2">
//                    <Users className="size-4  text-muted-foreground" />
//                 <span className="text-sm text-muted-foreground">Team:</span>
                
//              </div>

//                 <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent">
//                   <Avatar className=" size-8 border-2 border-white shrink-0 flex  ">
//                     <AvatarFallback className="bg-muted flex size-full items-center justify-center  text-xs text-foreground">
//                       A
//                     </AvatarFallback>
//                   </Avatar>
//                   <Avatar className=" size-8 border-2 border-white shrink-0 flex  ">
//                     <AvatarFallback className="bg-muted flex size-full items-center justify-center  text-xs text-foreground">
//                       A
//                     </AvatarFallback>
//                   </Avatar>
//                   <Avatar className=" size-8 border-2 border-white shrink-0 flex  ">
//                     <AvatarFallback className="bg-muted flex size-full items-center justify-center  text-xs text-foreground">
//                       A
//                     </AvatarFallback>
//                   </Avatar>
//                   <Avatar className=" size-8 border-2 border-white shrink-0 flex  ">
//                     <AvatarFallback className="bg-muted flex size-full items-center justify-center  text-xs text-foreground">
//                       A
//                     </AvatarFallback>
//                   </Avatar>
//                 </AvatarGroup>
//                 <span className="text-sm text-muted-foreground">4 members</span>
//               </div>
    

//           <div className="progress mb-3">
//             <Field className="w-full gap-0 mb-2">
//               <FieldLabel htmlFor="progress-upload" className="mb-2">
//                 <span className="text-sm font-normal">Progress</span>
//                 <span className="ml-auto text-sm font-medium">75%</span>
//               </FieldLabel>
//               <Progress
//                 value={75}
//                 id="progress-upload"
//                 className="h-2 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
//               />
//             </Field>
//           </div>
//           <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
//             <div className="flex items-center gap-1">
//               <Calendar className="size-4" />
//               <span>Due Apr 30, 2026</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Clock className="size-4" />
//               <span>Updated 2 hours ago</span>
//             </div>
//             <div className="flex items-center gap-1">
//              <Badge className="bg-secondary text-secondary-foreground text-xs">15 completed</Badge>
//              <Badge className="bg-secondary text-secondary-foreground text-xs">15  pending</Badge>
//             </div>
          
//           </div>
//         </div>
//         <div className="flex flex-row lg:flex-col items-center lg:items-start gap-2 lg:w-fit w-full">
//             <Button className="flex-1">
//                 <Eye className="size-4 mr-2"/>  
//                 View Details
//             </Button>
//                 <Button className="flex-1 lg:w-full " variant="outline">
//                 Grade Project
//             </Button>
//         </div>
//       </div>
//       </CardContent>
//     </Card>
//   );
// }
import React from "react";
import {
  CircleCheck,
  Clock,
  Eye,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { Project } from "@/types/team";

export default function ProjectCardSupervisor({
  project,
  role,
}: {
  project: Project;
  role: string;
}) {
  return (
    <Card className="p-0 gap-0 border hover:border-primary/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between flex-col lg:flex-row gap-6 lg:items-center">
          <div className="flex-1">
            <div className="mb-3">
              <h4 className="mb-2">{project.name}</h4>

              <Badge className="bg-success/10 text-success">
                <CircleCheck className="size-4 mr-1" />
                {project.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {project.description}
            </p>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Team:
                </span>
              </div>

              <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent">
                {project.memberships
                  ?.slice(0, 4)
                  .map((member) => (
                    <Avatar
                      key={member.id}
                      className="size-8 border-2 border-white"
                    >
                      <AvatarFallback className="bg-muted text-xs">
                        {member.user_detail.full_name
                          ?.charAt(0)
                          .toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
              </AvatarGroup>

              <span className="text-sm text-muted-foreground">
                {project.memberships.length} members
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech.id}
                  variant="secondary"
                >
                  {tech.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              {project.category && (
                <Badge variant="outline">
                  {project.category.name}
                </Badge>
              )}

              {project.semester && (
                <Badge variant="outline">
                  {project.semester.name}
                </Badge>
              )}

              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>
                  Updated{" "}
                  {new Date(
                    project.updated_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-start gap-2 lg:w-fit w-full">
            <Link
              href={`/${role}/projects/${project.id}`}
              className="flex-1 lg:w-full"
            >
              <Button className="w-full">
                <Eye className="size-4 mr-2" />
                View Details
              </Button>
            </Link>

            <Button
              variant="outline"
              className="flex-1 lg:w-full"
            >
              Grade Project
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}