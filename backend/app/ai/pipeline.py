from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.file import File
from app.ai.client import gemini
from app.ai.stages.context_builder import build_context
from app.ai.stages.analyzer import Analyzer
from app.ai.stages.planner import Planner
from app.ai.stages.generator import Generator
from app.ai.stages.reviewer import Reviewer
from app.parsers import parse_file


async def run_pipeline(
    db: AsyncSession, project_id: UUID, generation_type: str
) -> str:
    result = await db.execute(
        select(File).where(File.project_id == project_id)
    )
    files = result.scalars().all()

    parsed_files = []
    for f in files:
        parsed = await parse_file(f)
        parsed_files.append({"filename": f.filename, "content": parsed})

    context = build_context(parsed_files)

    analyzer = Analyzer(gemini)
    planner = Planner(gemini)
    generator = Generator(gemini)
    reviewer = Reviewer(gemini)

    analysis = await analyzer.analyze(context)
    plan = await planner.plan(analysis, generation_type)
    output = await generator.generate(context, plan)

    is_valid, feedback = await reviewer.review(output, context)
    if not is_valid:
        output = await generator.generate(context, plan, previous_feedback=feedback)

    return output
