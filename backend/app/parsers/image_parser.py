from io import BytesIO

from PIL import Image

from app.parsers.base import download_from_url


async def parse_image(url: str) -> str:
    content = await download_from_url(url)
    img = Image.open(BytesIO(content))
    info = {
        "format": img.format,
        "mode": img.mode,
        "width": img.width,
        "height": img.height,
    }
    return f"Image: {img.format} ({img.width}x{img.height}, {img.mode})"
