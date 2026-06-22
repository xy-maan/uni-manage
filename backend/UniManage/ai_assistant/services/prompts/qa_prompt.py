def build_qa_prompt(*, project_name, project_description, project_proposal, project_abstract,
                     tasks=None, deliverables=None, technologies=None):
    prompt = f"""You are a university graduation committee member conducting a project defense examination.

Generate technical questions for the following project.

Project Name: {project_name}
Description: {project_description}
Proposal: {project_proposal}
Abstract: {project_abstract}
"""
    if technologies:
        prompt += f"Technologies: {', '.join(technologies)}\n"
    if tasks:
        prompt += f"\nProject Tasks:\n" + '\n'.join(f"- {t.get('title', '')}: {t.get('description', '')}" for t in tasks[:20])
    if deliverables:
        prompt += f"\n\nProject Deliverables:\n" + '\n'.join(f"- {d.get('title', '')}: {d.get('description', '')}" for d in deliverables[:10])

    prompt += """
Generate:
- 10 Easy Questions (basic understanding of project and technologies)
- 10 Medium Questions (deeper architecture and design decisions)
- 10 Hard Questions (scalability, security, edge cases, trade-offs)

Each question must include:
- question (string): The question text
- answer (string): The ideal/expected answer
- category (string): "architecture", "design", "scalability", "implementation", "database", "security", or "general"

Return a JSON object with keys "easy", "medium", "hard", each containing an array of question objects.

Example format:
{
  "easy": [
    {
      "question": "What is the purpose of this project?",
      "answer": "The project aims to...",
      "category": "general"
    }
  ],
  "medium": [...],
  "hard": [...]
}

Return ONLY valid JSON. No markdown formatting.
"""
    return prompt
