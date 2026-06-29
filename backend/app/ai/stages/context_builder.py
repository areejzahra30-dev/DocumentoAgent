def build_context(parsed_files: list[dict]) -> str:
    sections = []
    for pf in parsed_files:
        content = pf["content"]
        if content.strip():
            sections.append(f"--- File: {pf['filename']} ---\n{content}")

    combined = "\n\n".join(sections)

    max_chars = 800_000
    if len(combined) > max_chars:
        combined = combined[:max_chars] + "\n\n[Content truncated due to length]"

    return combined
