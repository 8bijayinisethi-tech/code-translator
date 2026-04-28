# 🤖 Multi-Agent Code Translator

A production-grade AI system where four specialist agents collaborate to analyze, translate, and review code across 10+ programming languages.

![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![Docker](https://img.shields.io/badge/Docker-Containerised-2496ED)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900)

## Live Demo
http://52.66.213.205

---

## System Architecture

```
Browser (React)
      │
      │ HTTP POST /translate
      ▼
FastAPI Backend
      │
      ├── Agent 1: Orchestrator  → validates and routes request
      ├── Agent 2: Analyzer      → understands source code structure
      ├── Agent 3: Translator    → converts to target language
      └── Agent 4: Reviewer      → verifies and improves output
            │
            ▼
      Groq API (LLaMA 3.3 70B)
```

---

## Features

- **Multi-Agent Pipeline** — 4 specialist AI agents collaborate sequentially
- **10+ Language Pairs** — Perl, Python, JavaScript, TypeScript, Java, C++, Ruby, Go, Bash, SQL
- **Parallel Execution** — Orchestrator and Analyzer run simultaneously via asyncio.gather()
- **Real-time Agent Status** — Live UI showing which agent is active
- **Performance Timer** — Shows translation time after completion
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Python asyncio | Async parallel agent execution |
| Groq API | LLM inference (LLaMA 3.3 70B) |
| Pydantic Settings | Type-safe configuration management |
| Uvicorn | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| DM Mono / Syne | Typography |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerisation |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy + static file serving |
| AWS EC2 | Cloud deployment (t2.micro) |

---

## Agent Pipeline

Each agent is an independent Python module with a single responsibility:

```python
# agents/__init__.py — clean public interface
from .orchestrator import run as orchestrate
from .analyzer     import run as analyze
from .translator   import run as translate
from .reviewer     import run as review
```

```python
# main.py — parallel execution
_, analysis = await asyncio.gather(
    orchestrate(source_code, from_lang, to_lang),
    analyze(source_code, from_lang, to_lang)
)
draft = await translate(source_code, from_lang, to_lang, analysis)
final_code, review_note = await review(source_code, draft, from_lang, to_lang)
```

---

## Performance Optimisations

- **Parallel agents** — Orchestrator + Analyzer run simultaneously, saving ~3s
- **Skip analysis for short code** — Files under 300 chars skip deep analysis
- **Truly async** — Groq calls run in thread pool via loop.run_in_executor()
- **Result: ~3-4s** for typical code vs ~12s baseline

---

## Project Structure

```
code-translator/
├── backend/
│   ├── agents/
│   │   ├── __init__.py      # Public interface
│   │   ├── base.py          # Shared Groq client
│   │   ├── orchestrator.py  # Agent 1
│   │   ├── analyzer.py      # Agent 2
│   │   ├── translator.py    # Agent 3
│   │   └── reviewer.py      # Agent 4
│   ├── main.py              # FastAPI app + routes
│   ├── models.py            # Pydantic schemas
│   ├── conf_settings.py     # Settings management
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── App.jsx          # React app
│   ├── nginx.conf           # Nginx config
│   └── Dockerfile
└── docker-compose.yml
```

---

## Running Locally

### Prerequisites
- Python 3.11+
- Node.js 20+
- Groq API key from console.groq.com

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### With Docker
```bash
docker compose up --build
```

---

## API Reference

### POST /translate

Request:
```json
{
  "source_code": "my @arr = (1,2,3); print $_ for @arr;",
  "from_lang": "Perl",
  "to_lang": "Python"
}
```

Response:
```json
{
  "translated_code": "arr = [1,2,3]\nfor x in arr:\n    print(x)",
  "analysis": "Simple Perl array iteration using foreach...",
  "review_note": "OK: Translation is accurate and idiomatic"
}
```

---

## Future Improvements

- Streaming responses for large files
- User authentication and translation history
- Redis caching for repeated translations
- Support for more languages (COBOL, Rust, Swift)
- File upload support (.py, .js, .pl files)
- HTTPS with SSL certificate

---

## Author

**Bijayini Sethi** — Senior Full-Stack and Backend Engineer

LinkedIn: https://linkedin.com/in/bijayini-sethi-8a8541203
GitHub: https://github.com/8bijayinisethi-tech
