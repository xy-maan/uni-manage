import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircleCheck, Code, Eye, Star, Users } from "lucide-react";
import React from "react";
import { MarketplaceProjectCard } from "@/types/marketplace";
import { Link } from "@/i18n/navigation";

export default function CardMarketplace({
  project,
  switchLayout,
}: {
  project: MarketplaceProjectCard;
  switchLayout: string;
}) {
  const initials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const memberAvatars = project.member_count > 0 ? (
    <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent">
      {Array.from({ length: Math.min(project.member_count, 3) }).map((_, i) => (
        <Avatar key={i} className="border-2 border-background size-7 shrink-0 flex">
          <AvatarFallback className="flex size-full items-center justify-center text-xs text-foreground bg-primary/10">
            {String.fromCharCode(65 + i)}
          </AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ) : null;

  return (
    <>
      {switchLayout == "grid" &&
        <Card className="p-0 border-primary/30">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge className="bg-success/10 text-success hover:bg-success/20">
                <CircleCheck className="mr-1 size-3" />
                Completed
              </Badge>
              {project.category && (
                <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
                  {project.category}
                </Badge>
              )}
            </div>
            <h4 className="text-lg line-clamp-2 mb-3">
              {project.name}
            </h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="">{project.academic_year || ''}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-warning text-warning" />
                  {project.project_type === 'graduation' ? 'Graduation' : 'Course'}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
              {project.description}
            </p>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {memberAvatars}
                <span className="text-xs text-muted-foreground">{project.member_count} members</span>
              </div>
              {project.supervisor_count > 0 && (
                <Badge variant="outline">{project.supervisor_count} supervisor{project.supervisor_count > 1 ? 's' : ''}</Badge>
              )}
            </div>
            <div className="mb-4 flex flex-wrap gap-1">
              {project.technology_names.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
              {project.technology_names.length > 4 && (
                <Badge variant="outline">+{project.technology_names.length - 4}</Badge>
              )}
            </div>
            <div className="border-t pt-2">
              <Link href={`/marketplace/${project.id}`}>
                <Button variant="outline" className="w-full">
                  <Eye className="size-3" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      }

      {switchLayout == "list" &&
        <Card className="p-0 border-primary/30 mb-4">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4 lg:flex-row lg:gap-0 gap-2 flex-col">
                  <div className="">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge className="bg-success/10 text-success hover:bg-success/20">
                        <CircleCheck className="mr-1 size-3" />
                        Completed
                      </Badge>
                      {project.category && (
                        <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
                          {project.category}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {project.project_type === 'graduation' ? 'Graduation' : 'Course'}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-semibold hover:text-primary transition-all cursor-pointer">
                      {project.name}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {project.academic_year && (
                    <div className="flex items-center gap-1.5">
                      <Code className="size-4" />
                      <span>{project.academic_year}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {memberAvatars}
                    <span className="text-xs text-muted-foreground">{project.member_count} members</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technology_names.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                  {project.technology_names.length > 4 && (
                    <Badge variant="outline">+{project.technology_names.length - 4}</Badge>
                  )}
                </div>
              </div>
              <div className="flex lg:flex-col gap-2 lg:w-48 items-stretch lg:justify-center">
                <Link href={`/marketplace/${project.id}`}>
                  <Button variant="outline" className="w-full flex-1">
                    <Eye className="size-3" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>}
    </>
  );
}
