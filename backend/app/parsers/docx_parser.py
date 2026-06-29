from io import BytesIO

import mammoth

from app.parsers.base import download_from_url


async def parse_docx(url: str) -> str:
    content = await download_from_url(url)
    result = mammoth.extract_raw_text(BytesIO(content))
    return result.value
