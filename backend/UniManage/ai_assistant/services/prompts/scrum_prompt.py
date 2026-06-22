def build_scrum_prompt(*, project_description, project=None):
    prompt = f"""You are a senior Scrum Master at a software development company.

Break down the following project into Epics, Features, Tasks, and Subtasks.

Project Description: {project_description}
"""
    if project:
        prompt += f"""
Additional project context:
- Methodology: {project.get_methodology_display() if project.methodology else 'Not specified'}
- Technologies: {', '.join(t.name for t in project.technologies.all()) if project.technologies.exists() else 'Not specified'}
- Existing tasks: {project.tasks.count()}
"""

    prompt += """
For each epic, provide:
- name (string)
- description (string)

For each feature under an epic, provide:
- name (string)
- description (string)

For each task under a feature, provide:
- title (string)
- description (string)
- priority (string: "low", "medium", "high", "urgent")
- estimated_hours (number)

For each subtask under a task, provide:
- title (string)
- description (string)

Return a JSON object with a key "epics" containing an array of epic objects.

Example format:
{
  "epics": [
    {
      "name": "User Authentication",
      "description": "...",
      "features": [
        {
          "name": "Login",
          "description": "...",
          "tasks": [
            {
              "title": "Implement JWT login endpoint",
              "description": "...",
              "priority": "high",
              "estimated_hours": 8,
              "subtasks": [
                {"title": "Create login serializer", "description": "..."}
              ]
            }
          ]
        }
      ]
    }
  ]
}

Return ONLY valid JSON. No markdown formatting.
"""
    return prompt
