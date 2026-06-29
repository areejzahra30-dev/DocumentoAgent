from app.ai.client import GeminiClient


README_SECTIONS = [
    "Project Title",
    "Description",
    "Features",
    "Tech Stack",
    "Installation",
    "Usage",
    "Project Structure",
    "Contributing",
    "License",
]

SUMMARY_SECTIONS = [
    "Overview",
    "Key Concepts",
    "Important Details",
    "Definitions",
    "Key Points",
]


class Planner:
    def __init__(self, client: GeminiClient):
        self.client = client

    async def plan(self, analysis: dict, generation_type: str) -> dict:
        sections = (
            README_SECTIONS if generation_type == "readme" else SUMMARY_SECTIONS
        )

        plan = {
            "type": generation_type,
            "sections": sections,
            "tone": "professional",
            "language": "en",
        }

        if analysis.get("languages"):
            plan["languages"] = analysis["languages"]
        if analysis.get("frameworks"):
            plan["frameworks"] = analysis["frameworks"]

        return plan
