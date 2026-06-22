"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Cpu, X } from "lucide-react"
import { techStackAdvisorAction } from "@/Actions/ai.actions"
import type { TechStackResponse } from "@/types/ai"

export function TechStackAdvisor() {
  const [idea, setIdea] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TechStackResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
    }
    setSkillInput("")
  }

  const removeSkill = (s: string) => {
    setSkills(skills.filter(x => x !== s))
  }

  const handleSubmit = async () => {
    if (idea.length < 10) return
    setLoading(true)
    setError(null)
    setResult(null)
    const { payload, ok } = await techStackAdvisorAction({ idea, skills })
    if (ok && payload) {
      setResult(payload)
    } else {
      setError("Failed to get recommendation. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Get optimal technology stack recommendations for your project.
      </p>
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your project idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill (e.g., React)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>Add</Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map(s => (
              <Badge key={s} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(s)}>
                {s} <X className="size-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={loading || idea.length < 10} className="w-full">
        {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Analyzing...</> : <><Cpu className="size-4 mr-2" /> Recommend Stack</>}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {(["frontend", "backend", "database", "authentication", "deployment", "hosting", "devops", "reasoning"] as const).map((key) => (
            <div key={key} className="flex items-start gap-2 text-sm">
              <Badge variant="outline" className="shrink-0 capitalize">{key}</Badge>
              <span className="text-muted-foreground">{result[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
