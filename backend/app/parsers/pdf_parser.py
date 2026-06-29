from io import BytesIO

from pypdf import PdfReader

from app.parsers.base import download_from_url


async def parse_pdf(url: str) -> str:
    content = await download_from_url(url)
    reader = PdfReader(BytesIO(content))
    text = []
    for page in reader.pages:
        text.append(page.extract_text())
    return "\n".join(text)
