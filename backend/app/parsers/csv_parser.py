from io import StringIO
import csv

from app.parsers.base import download_from_url


async def parse_csv(url: str) -> str:
    content = await download_from_url(url)
    text = content.decode("utf-8", errors="replace")
    reader = csv.reader(StringIO(text))

    rows = []
    for i, row in enumerate(reader):
        if i < 100:
            rows.append(", ".join(row))

    total_rows = i + 1 if text.strip() else 0
    result = "\n".join(rows)
    if total_rows > 100:
        result += f"\n\n[... {total_rows - 100} more rows omitted]"
    return result
