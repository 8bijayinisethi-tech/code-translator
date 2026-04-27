from .base import call_claude

async def run(source_code: str, from_lang: str, to_lang: str) -> str:
    """
    Agent 2 — understands the source code structure.
    Scope: could return structured JSON with complexity score,
    detected patterns, risk areas — not just plain text.
    """
    system = """You are a code analysis specialist. Analyze source code 
    and respond in 2-3 sentences covering: language constructs used, 
    complexity level, and key patterns to watch when translating. 
    Be concise and technical."""

    user = f"""Analyze this {from_lang} code for translation to {to_lang}:
        {source_code}"""

    return await call_claude(system, user)

