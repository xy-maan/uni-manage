"use client"
import { getMarketplaceProjectDetailAction } from '@/Actions/getMarketplaceProjectDetail.action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MarketplaceProjectDetail } from '@/types/marketplace'
import { ArrowLeft, BookOpen, Calendar, Code, ExternalLink, FolderGit2, Users } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function MarketplaceProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<MarketplaceProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const projectId = parseInt(params.projectId as string)
      if (isNaN(projectId)) {
        setLoading(false)
        return
      }
      const { ok, payload } = await getMarketplaceProjectDetailAction(projectId)
      if (ok) setProject(payload)
      setLoading(false)
    }
    load()
  }, [params.projectId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Project not found.</p>
          <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push('/marketplace')}>
        <ArrowLeft className="size-4 mr-2" />
        Back to Marketplace
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>
            {project.category && (
              <Badge variant="outline">{project.category}</Badge>
            )}
            <Badge variant="outline">
              {project.project_type === 'graduation' ? 'Graduation Project' : 'Course Project'}
            </Badge>
            {project.methodology && (
              <Badge variant="secondary">{project.methodology}</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {project.description && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Description</h2></CardHeader>
              <CardContent><p className="text-muted-foreground">{project.description}</p></CardContent>
            </Card>
          )}

          {project.proposal && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Proposal</h2></CardHeader>
              <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{project.proposal}</p></CardContent>
            </Card>
          )}

          {project.abstract && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Abstract</h2></CardHeader>
              <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{project.abstract}</p></CardContent>
            </Card>
          )}

          {project.expected_scope && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Expected Scope</h2></CardHeader>
              <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{project.expected_scope}</p></CardContent>
            </Card>
          )}

          {project.technology_names.length > 0 && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Technologies</h2></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technology_names.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-sm py-1 px-3">
                      <Code className="size-3 mr-1" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {project.members.length > 0 && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Team Members</h2></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.members.map((member) => {
                    const roleLabel = member.role === 'leader' ? 'Leader' : member.role === 'co_leader' ? 'Co-Leader' : 'Member'
                    const roleClass = member.role === 'leader' ? 'bg-primary/10 text-primary' : member.role === 'co_leader' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {member.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                          </div>
                        </div>
                        <Badge className={roleClass}>{roleLabel}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {project.supervisors.length > 0 && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Supervisors</h2></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.supervisors.map((supervisor) => {
                    const roleLabel = supervisor.role === 'primary' ? 'Primary Supervisor' : 'Secondary Supervisor'
                    const roleClass = supervisor.role === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary-foreground'
                    return (
                      <div key={supervisor.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {supervisor.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <p className="font-medium">{supervisor.name}</p>
                        </div>
                        <Badge className={roleClass}>{roleLabel}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {(project.repository_url || project.documentation_url) && (
            <Card>
              <CardHeader><h2 className="text-xl font-semibold">Resources</h2></CardHeader>
              <CardContent className="space-y-3">
                {project.repository_url && (
                  <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <FolderGit2 className="size-4" />
                    Repository
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {project.documentation_url && (
                  <a href={project.documentation_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <BookOpen className="size-4" />
                    Documentation
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><h2 className="text-xl font-semibold">Project Information</h2></CardHeader>
            <CardContent className="space-y-4">
              {project.academic_year && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Academic Year:</span>
                  <span className="font-medium">{project.academic_year}</span>
                </div>
              )}
              {project.semester && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Semester:</span>
                  <span className="font-medium">{project.semester}</span>
                </div>
              )}
              {project.archive_year && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Archive Year:</span>
                  <span className="font-medium">{project.archive_year}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">{new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h2 className="text-xl font-semibold">Statistics</h2></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Team Members:</span>
                <span className="font-medium">{project.member_count}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Supervisors:</span>
                <span className="font-medium">{project.supervisor_count}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Code className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Technologies:</span>
                <span className="font-medium">{project.technology_count}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
