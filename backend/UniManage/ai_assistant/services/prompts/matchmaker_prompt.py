def build_matchmaker_prompt(*, skills, team_size, project_type, current_project=None):
    skills_text = ', '.join(s.name for s in skills) if skills else 'Not specified'
    prompt = f"""You are an expert academic project advisor.

Generate 10 software project ideas suitable for a university {project_type} project.

Student Skills: {skills_text}
Project Type: {project_type}
Team Size: {team_size}
"""
    if current_project:
        prompt += f"""
Current project technologies: {', '.join(t.name for t in current_project.technologies.all())}
Current project description: {current_project.description}
"""

    prompt += """
For each idea, provide the following in valid JSON format:
- title (string)
- description (string, 2-3 sentences)
- difficulty (string: "beginner", "intermediate", "advanced")
- technologies (array of strings)
- expected_team_roles (array of strings)
- innovation_score (integer, 1-10)

Return a JSON object with a key "ideas" containing an array of exactly 10 ideas.

Example format:
{
  "ideas": [
    {
      "title": "Smart Campus Navigation App",
      "description": "...",
      "difficulty": "intermediate",
      "technologies": ["React Native", "Node.js"],
      "expected_team_roles": ["Frontend Developer", "Backend Developer", "Mobile Developer"],
      "innovation_score": 8
    }
  ]
}

Return ONLY valid JSON. No markdown formatting.
"""
    return prompt
