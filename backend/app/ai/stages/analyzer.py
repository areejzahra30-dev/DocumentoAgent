from app.ai.client import GeminiClient


SYSTEM_PROMPT = """You are a code and document analyzer. Analyze the provided content and determine:
1. Is this a software project or just documents?
2. What programming languages are present?
3. What frameworks are used (if any)?
4. File categories present (code, config, documentation, data, images)
5. Brief summary of the contents

Return a structured JSON analysis."""


class Analyzer:
    def __init__(self, client: GeminiClient):
        self.client = client

    async def analyze(self, context: str) -> dict:
        prompt = f"Analyze the following project content and return a structured analysis:\n\n{context[:50000]}"
        result = await self.client.generate(prompt, system_instruction=SYSTEM_PROMPT)

        import json
        import re

        json_match = re.search(r"\{.*\}", result, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        return {
            "raw_analysis": result,
            "is_project": True,
            "languages": [],
            "frameworks": [],
            "categories": [],
            "summary": result[:500],
        }
