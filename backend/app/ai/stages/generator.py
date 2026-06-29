from app.ai.client import GeminiClient


README_SYSTEM_PROMPT = """You are a professional README generator.
Generate a comprehensive GitHub README.md based on the provided project content.
Rules:
- Never fabricate or invent project details not present in the content.
- Use proper Markdown formatting.
- Include appropriate badges, code blocks, and structure.
- Be honest about the project scope.
- Use the section plan provided."""

SUMMARY_SYSTEM_PROMPT = """You are a professional document summarizer.
Generate a structured summary based on the provided content.
Rules:
- Focus on important concepts, key details, definitions, and key points.
- Avoid unnecessary repetition.
- Use clear section headings and bullet points where appropriate.
- Be concise but comprehensive."""


class Generator:
    def __init__(self, client: GeminiClient):
        self.client = client

    async def generate(
        self,
        context: str,
        plan: dict,
        previous_feedback: str | None = None,
    ) -> str:
        system_prompt = (
            README_SYSTEM_PROMPT if plan["type"] == "readme" else SUMMARY_SYSTEM_PROMPT
        )

        sections = "\n".join(f"- {s}" for s in plan["sections"])

        prompt = f"""Generate a {plan['type']} based on the following content and section plan.

Content:
{context[:100000]}

Required Sections:
{sections}

Language: {plan.get('language', 'en')}
Tone: {plan.get('tone', 'professional')}

Output in Markdown format.
"""

        if previous_feedback:
            prompt += f"\n\nPrevious review feedback to address:\n{previous_feedback}"

        return await self.client.generate(prompt, system_instruction=system_prompt)
