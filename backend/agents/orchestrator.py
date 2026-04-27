from .base import call_claude

async def run(source_code: str, from_lang: str, to_lang: str) -> str:
    """
    This Orchestrator agent will validate the request and confirms the task.
    Scope: could add language  detection, complexity scoring here

    """
    system = """ You are a orchestrator agent. Your job is to validate the 
            translation request and confirm the task clearly in one sentence."""
    
    user = f"""Validate and confirm this task:
        - Translate from: {from_lang}
        - Translate to: {to_lang}
        - Code length: {len(source_code)} characters
        Confirm the task in one sentence."""   

    return await call_claude(system,user)