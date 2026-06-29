from tenacity import retry, stop_after_attempt, wait_exponential

from app.ai.client import GeminiClient


SYSTEM_PROMPT = """You are a quality reviewer for generated documentation.
Review the output for:
1. Completeness — does it cover all required aspects?
2. Markdown formatting — is the syntax correct?
3. Missing sections — are any expected sections absent?
4. Consistency — does the output match the source content?

Return "PASS" if the output is acceptable, or provide specific feedback on what needs improvement."""


class Reviewer:
    def __init__(self, client: GeminiClient):
        self.client = client

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def review(self, output: str, context: str) -> tuple[bool, str]:
        prompt = f"""Review the following generated output against the original context.

Context (first 2000 chars):
{context[:2000]}

Generated Output:
{output}

Does this pass quality review? Respond with "PASS" or provide specific feedback."""

        result = await self.client.generate(prompt, system_instruction=SYSTEM_PROMPT)

        if "PASS" in result.strip().upper()[:10]:
            return True, ""

        return False, result
