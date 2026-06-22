def build_techstack_prompt(*, idea, skills=None, project=None):
    skills_text = ', '.join(skills) if skills else 'None specified'
    prompt = f"""You are a senior software architect.

Recommend optimal software architecture for the following project idea.

Project Idea: {idea}
Team Skills: {skills_text}
"""
    if project:
        prompt += f"""
Existing project technologies: {', '.join(t.name for t in project.technologies.all()) if project.technologies.exists() else 'Not specified'}
"""

    prompt += """
Recommend specific technologies for each layer and explain your reasoning.

Return a JSON object with the following keys:
- frontend (string): Recommended frontend framework/library with brief rationale
- backend (string): Recommended backend framework/language with brief rationale
- database (string): Recommended database system with brief rationale
- authentication (string): Recommended auth solution with brief rationale
- deployment (string): Recommended deployment strategy with brief rationale
- hosting (string): Recommended hosting platform with brief rationale
- devops (string): Recommended CI/CD and DevOps tools with brief rationale
- reasoning (string): Overall architectural reasoning paragraph explaining why these choices work together

Prioritize technologies the team already knows when appropriate.

Return ONLY valid JSON. No markdown formatting.
"""
    return prompt
