import json

from app.parsers.base import download_from_url


async def parse_json(url: str) -> str:
    content = await download_from_url(url)
    data = json.loads(content)
    return json.dumps(data, indent=2, ensure_ascii=False)[:10000]
