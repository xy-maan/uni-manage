def build_proposal_refiner_prompt(*, proposal, project=None):
    prompt = f"""You are an academic writing expert specializing in university graduation project proposals.

Improve the following project proposal.

Original Proposal: {proposal}
"""
    if project:
        prompt += f"""
Additional project context:
- Project name: {project.name}
- Project abstract: {project.abstract}
- Expected scope: {project.expected_scope}
- Project type: {project.get_project_type_display()}
"""

    prompt += """
Enhance:
1. Academic language and tone
2. Clarity and structure
3. Scope definition (make it specific and measurable)
4. Objectives (SMART format)
5. Technical feasibility assessment

Return a JSON object with the following keys:
- improved_proposal (string): The full refined proposal in academic style
- weaknesses (array of strings): 3-5 weaknesses detected in the original proposal
- recommendations (array of strings): 3-5 actionable recommendations for improvement

Return ONLY valid JSON. No markdown formatting.
"""
    return prompt
