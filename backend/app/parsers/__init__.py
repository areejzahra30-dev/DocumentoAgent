from app.parsers.pdf_parser import parse_pdf
from app.parsers.docx_parser import parse_docx
from app.parsers.txt_parser import parse_txt
from app.parsers.md_parser import parse_md
from app.parsers.image_parser import parse_image
from app.parsers.csv_parser import parse_csv
from app.parsers.xlsx_parser import parse_xlsx
from app.parsers.pptx_parser import parse_pptx
from app.parsers.json_parser import parse_json

CODE_EXTENSIONS = {
    ".js", ".ts", ".py", ".java", ".cpp", ".c", ".h", ".rs", ".go",
    ".rb", ".php", ".swift", ".kt", ".html", ".css", ".scss", ".less",
    ".xml", ".yaml", ".yml", ".toml", ".sh", ".bash", ".sql",
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


async def parse_file(file) -> str:
    ext = f".{file.file_type.lower()}" if not file.file_type.startswith(".") else file.file_type.lower()

    if ext == ".pdf":
        return await parse_pdf(file.storage_url)
    elif ext == ".docx":
        return await parse_docx(file.storage_url)
    elif ext == ".txt":
        return await parse_txt(file.storage_url)
    elif ext == ".md":
        return await parse_md(file.storage_url)
    elif ext in IMAGE_EXTENSIONS:
        return await parse_image(file.storage_url)
    elif ext == ".csv":
        return await parse_csv(file.storage_url)
    elif ext == ".xlsx":
        return await parse_xlsx(file.storage_url)
    elif ext == ".pptx":
        return await parse_pptx(file.storage_url)
    elif ext == ".json":
        return await parse_json(file.storage_url)
    elif ext in CODE_EXTENSIONS:
        return await parse_txt(file.storage_url)
    else:
        return f"[Unsupported file type: {file.file_type}]"


__all__ = [
    "parse_file",
    "parse_pdf",
    "parse_docx",
    "parse_txt",
    "parse_md",
    "parse_image",
    "parse_csv",
    "parse_xlsx",
    "parse_pptx",
    "parse_json",
]
