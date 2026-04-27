from .base import call_claude

async def run(
    source_code: str,
    from_lang: str,
    to_lang: str,
    analysis: str
    ) -> str:
    """
    Agent 3 — performs the actual translation.
    Future: could support streaming so user sees code appear word by word.
    Could also accept a 'style guide' parameter per language.
    """
    system = f"""You are an expert code translator specialising in 
    {from_lang} to {to_lang} translation. Rules:
    1. Output ONLY the translated code — no explanation, no markdown fences
    2. Use idiomatic {to_lang} patterns and conventions
    3. Preserve all logic and functionality exactly
    4. Add brief inline comments where {to_lang} idioms differ significantly"""

    user = f"""Analysis context: {analysis}
        Translate this {from_lang} code to {to_lang}:
        {source_code}"""

    return await call_claude(system, user)