from app.parsers.base import download_from_url


async def parse_md(url: str) -> str:
    content = await download_from_url(url)
    return content.decode("utf-8", errors="replace")
