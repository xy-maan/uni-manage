"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lightbulb, Users, Type } from "lucide-react"
import { projectMatchmakerAction } from "@/Actions/ai.actions"
import type { ProjectIdea } from "@/types/ai"

export function ProjectMatchmaker() {
  const [teamSize, setTeamSize] = useState(5)
  const [projectType, setProjectType] = useState<"course" | "graduation">("graduation")
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<ProjectIdea[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setIdeas(null)
    const { payload, ok } = await projectMatchmakerAction({ team_size: teamSize, project_type: projectType })
    if (ok && payload) {
      setIdeas(payload.ideas)
    } else {
      setError("Failed to generate ideas. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Generate project ideas based on your skills and preferences.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team-size" className="flex items-center gap-2">
            <Users className="size-4" /> Team Size
          </Label>
          <Input
            id="team-size"
            type="number"
            min={1}
            max={10}
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-type" className="flex items-center gap-2">
            <Type className="size-4" /> Project Type
          </Label>
          <select
            id="project-type"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as "course" | "graduation")}
          >
            <option value="course">Course</option>
            <option value="graduation">Graduation</option>
          </select>
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Generating...</> : <><Lightbulb className="size-4 mr-2" /> Generate Ideas</>}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {ideas && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {ideas.map((idea, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{idea.title}</h4>
                  <Badge variant={idea.difficulty === "advanced" ? "destructive" : idea.difficulty === "intermediate" ? "secondary" : "outline"}>
                    {idea.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{idea.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {idea.technologies.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Roles: {idea.expected_team_roles.join(", ")}</span>
                  <span>Innovation: {idea.innovation_score}/10</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
