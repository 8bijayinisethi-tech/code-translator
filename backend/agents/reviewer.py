from .base import call_claude

async def run(
    source_code: str,
    translated_code: str,
    from_lang: str,
    to_lang: str
) -> tuple[str, str]:
    """
    Agent 4 — reviews and optionally improves the translation.
    Scope: could return a confidence score, line-by-line diff,
    or flag specific lines that need human review.
    Returns: (final_code, review_note)
    """
    system = """You are a code reviewer checking translation correctness.
    Respond with ONLY:
    - First line: either 'OK: <one sentence>' or 'IMPROVED: <one sentence>'
    - If IMPROVED: leave a blank line then write the corrected code"""

    user = f"""Review this {from_lang} to {to_lang} translation.
        Original {from_lang}:
        {source_code}

        Translated {to_lang}:
        {translated_code}"""

    response = await call_claude(system, user)

    if response.startswith("IMPROVED:"):
        parts = response.split("\n\n", 1)
        note = parts[0].replace("IMPROVED: ", "").strip()
        final_code = parts[1].strip() if len(parts) > 1 else translated_code
        return final_code, f"Improved: {note}"
    else:
        note = response.replace("OK: ", "").strip()
        return translated_code, f"OK: {note}"