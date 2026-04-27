import asyncio
from groq import Groq
from conf_settings import settings

client = Groq(api_key=settings.groq_api_key)

async def call_claude(system_prompt: str, user_message: str) -> str:
    """
    Shared helper used by every agent.
    Named call_claude so all agent files stay untouched.
    """
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message}
            ],
            max_tokens=1000
        )
    )
    return response.choices[0].message.content

