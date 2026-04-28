import { useState } from "react";

const LANGUAGES = [
  "Perl", "Python", "JavaScript", "TypeScript",
  "Java", "C++", "Ruby", "Go", "Bash", "SQL"
];

const AGENTS = [
  { name: "Orchestrator", role: "Route & validate",   icon: "01" },
  { name: "Analyzer",     role: "Parse & understand", icon: "02" },
  { name: "Translator",   role: "Convert language",   icon: "03" },
  { name: "Reviewer",     role: "Verify & improve",   icon: "04" },
];

const DEFAULT_STATES = AGENTS.map(() => ({ status: "idle", message: "Standing by" }));

const EXAMPLES = [
  { label: "Perl → Python",      from: "Perl",       to: "Python",
    code: `my @numbers = (1..10);\nmy @evens = grep { $_ % 2 == 0 } @numbers;\nmy @squared = map { $_ ** 2 } @evens;\nforeach my $n (@squared) {\n    print "$n\\n";\n}` },
  { label: "JS → TypeScript",    from: "JavaScript", to: "TypeScript",
    code: `function fetchUser(userId) {\n  return fetch('/api/users/' + userId)\n    .then(res => res.json())\n    .then(data => ({ id: data.id, name: data.name }));\n}` },
  { label: "Bash → Python",      from: "Bash",       to: "Python",
    code: `#!/bin/bash\nfor f in /var/log/*.log; do\n  count=$(grep -c "ERROR" "$f")\n  echo "$f: $count errors"\ndone` },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    min-height: 100vh;
    background: #0e0c15;
    margin: 0; padding: 0;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #f0eafa;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(218,119,86,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(147,112,219,0.1) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 60% 30%, rgba(205,133,63,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .app {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 32px 100px;
  }

  .header { 
  margin-bottom: 56px; 
  text-align: center;
  }

  .eyebrow {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #da7756;
    margin-bottom: 20px;
  }
  .eyebrow-line { width: 32px; height: 2px; background: #da7756; border-radius: 2px; }

  h1 {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f5f0ff 0%, #da7756 50%, #c9a96e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  }

  .subtitle {
  font-size: 18px;
  color: #9985b0;
  font-weight: 300;
  line-height: 1.6;
  margin: 0 auto;   /* ← centers it */
  }

  .pipeline-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b5a82;
    margin-bottom: 16px;
  }

  .pipeline {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
    margin-bottom: 48px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 3px;
  }

  .agent-card {
    padding: 20px;
    border-radius: 18px;
    background: transparent;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .agent-card.active { background: rgba(218,119,86,0.1); box-shadow: inset 0 0 0 1px rgba(218,119,86,0.3); }
  .agent-card.done   { background: rgba(147,112,219,0.08); box-shadow: inset 0 0 0 1px rgba(147,112,219,0.25); }
  .agent-card.error  { background: rgba(239,68,68,0.08); box-shadow: inset 0 0 0 1px rgba(239,68,68,0.3); }

  .agent-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #4a3a5c;
    margin-bottom: 12px;
    letter-spacing: 0.08em;
    transition: color 0.3s;
  }
  .agent-card.active .agent-num { color: #da7756; }
  .agent-card.done .agent-num   { color: #9370db; }

  .agent-name {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #c8b8e0;
    margin-bottom: 4px;
    transition: color 0.3s;
  }
  .agent-card.active .agent-name,
  .agent-card.done .agent-name { color: #f5f0ff; }

  .agent-role {
    font-size: 13px;
    color: #5a4a70;
    margin-bottom: 14px;
    transition: color 0.3s;
  }
  .agent-card.active .agent-role,
  .agent-card.done .agent-role { color: #9985b0; }

  .agent-status-row { display: flex; align-items: center; gap: 8px; }

  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #2a1f3a;
    flex-shrink: 0;
    transition: background 0.3s;
  }
  .agent-card.active .status-dot { background: #da7756; animation: pulse 1s infinite; }
  .agent-card.done .status-dot   { background: #9370db; }
  .agent-card.error .status-dot  { background: #ef4444; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .agent-msg {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #4a3a5c;
    transition: color 0.3s;
  }
  .agent-card.active .agent-msg { color: #da7756; }
  .agent-card.done .agent-msg   { color: #9370db; }
  .agent-card.error .agent-msg  { color: #ef4444; }

  .examples-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .examples-label {
    font-size: 12px;
    font-weight: 600;
    color: #4a3a5c;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .ex-btn {
    padding: 8px 16px;
    border-radius: 99px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #9985b0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .ex-btn:hover { border-color: #da7756; color: #da7756; background: rgba(218,119,86,0.06); }

  .controls {
    display: grid;
    grid-template-columns: 1fr 56px 1fr;
    gap: 12px;
    align-items: end;
    margin-bottom: 16px;
  }

  .lang-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b5a82;
    margin-bottom: 8px;
  }

  select {
    width: 100%;
    padding: 14px 40px 14px 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #f0eafa;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%236b5a82' d='M7 9L2 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
  }
  select option { background: #1a1226; color: #f0eafa; }
  select:focus { border-color: #da7756; }

  .swap-btn {
    width: 56px; height: 50px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #6b5a82;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex; align-items: center; justify-content: center;
  }
  .swap-btn:hover { border-color: #da7756; color: #da7756; transform: rotate(180deg); }

  .editors {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .editor-pane {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
    background: rgba(10,8,18,0.8);
    display: flex;
    flex-direction: column;
  }

  .pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }

  .pane-title { display: flex; align-items: center; gap: 10px; }
  .traffic-lights { display: flex; gap: 5px; }
  .tl { width: 10px; height: 10px; border-radius: 50%; }
  .tl-r { background: #ff5f57; }
  .tl-y { background: #febc2e; }
  .tl-g { background: #28c840; }
  .pane-lang {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    color: #6b5a82;
    letter-spacing: 0.06em;
  }

  .copy-btn {
    font-size: 12px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #9985b0;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .copy-btn:hover { border-color: #da7756; color: #da7756; }

  textarea {
    flex: 1;
    width: 100%;
    min-height: 280px;
    padding: 20px;
    background: transparent;
    border: none;
    color: #e8dff8;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    line-height: 1.8;
    resize: vertical;
    outline: none;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
  }
  textarea::placeholder { color: #2a1f3a; font-style: italic; }
  textarea[readonly] { color: #c4b5e0; cursor: default; }

  .translate-btn {
    width: 100%;
    padding: 18px 32px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #da7756 0%, #c9603a 50%, #b8491f 100%);
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    letter-spacing: 0.01em;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 4px 24px rgba(218,119,86,0.25);
  }
  .translate-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .translate-btn:hover:not(:disabled)::before { left: 100%; }
  .translate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(218,119,86,0.4); }
  .translate-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

  .result-box {
    padding: 20px 24px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    margin-bottom: 12px;
  }
  .result-box.review-ok       { border-color: rgba(147,112,219,0.25); }
  .result-box.review-improved { border-color: rgba(201,160,110,0.3); }

  .result-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b5a82;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .result-label-dot { width: 6px; height: 6px; border-radius: 50%; background: #da7756; }
  .review-ok .result-label-dot       { background: #9370db; }
  .review-improved .result-label-dot { background: #c9a06e; }

  .result-text {
    font-size: 15px;
    color: #b8a8d0;
    line-height: 1.75;
    font-weight: 300;
  }

  .error-box {
    padding: 16px 20px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px;
    color: #fca5a5;
    font-size: 14px;
    margin-bottom: 12px;
    font-family: 'DM Mono', monospace;
  }

  @media (max-width: 900px) {
    .app { padding: 32px 20px 80px; }
    h1 { font-size: 48px; }
    .editors { grid-template-columns: 1fr; }
    .pipeline { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .app { padding: 24px 16px 60px; }
    h1 { font-size: 36px; }
    .subtitle { font-size: 15px; }
    .controls { grid-template-columns: 1fr; gap: 10px; }
    .swap-btn { width: 100%; }
    .pipeline { grid-template-columns: 1fr 1fr; gap: 2px; }
    .agent-card { padding: 14px; }
    textarea { min-height: 200px; font-size: 13px; }
    .translate-btn { font-size: 16px; padding: 16px; }
  }
`;

export default function App() {
  const [sourceCode,  setSourceCode]  = useState("");
  const [outputCode,  setOutputCode]  = useState("");
  const [fromLang,    setFromLang]    = useState("Perl");
  const [toLang,      setToLang]      = useState("Python");
  const [loading,     setLoading]     = useState(false);
  const [agentStates, setAgentStates] = useState(DEFAULT_STATES);
  const [analysis,    setAnalysis]    = useState("");
  const [reviewNote,  setReviewNote]  = useState("");
  const [error,       setError]       = useState("");
  const [copied,      setCopied]      = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);

  const setAgent = (i, status, message) =>
    setAgentStates(prev => prev.map((a, idx) => idx === i ? { status, message } : a));

  const handleSwap = () => {
  setFromLang(toLang);
  setToLang(fromLang);
  setSourceCode("");
  setOutputCode("");
  setAnalysis("");
  setReviewNote("");
  setTimeTaken(null);
  setAgentStates(DEFAULT_STATES);
  };

  const handleCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = outputCode;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = (ex) => {
  setFromLang(ex.from);
  setToLang(ex.to);
  setSourceCode(ex.code);
  setOutputCode("");
  setAnalysis("");
  setReviewNote("");
  setError("");
  setTimeTaken(null);
  setAgentStates(DEFAULT_STATES);
  };

  const handleTranslate = async () => {
    setLoading(true); setError("");
    setOutputCode(""); setAnalysis(""); setReviewNote("");
    setTimeTaken(null);
    const startTime = Date.now();
    setAgentStates(DEFAULT_STATES);
    setAgent(0, "active", "Routing...");

    try {
      const API_URL = import.meta.env.VITE_API_URL ||  "http://52.66.213.205:8000";
      const res = await fetch(`${API_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: sourceCode, from_lang: fromLang, to_lang: toLang })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong");
      }

      setAgent(0, "done",   "Routed ✓");
      setAgent(1, "active", "Analyzing...");
      const data = await res.json();

      setAgent(1, "done",   "Analyzed ✓");
      setAgent(2, "active", "Translating...");
      await new Promise(r => setTimeout(r, 350));

      setAgent(2, "done",   "Translated ✓");
      setAgent(3, "active", "Reviewing...");
      await new Promise(r => setTimeout(r, 350));

      setAgent(3, "done", "Reviewed ✓");
      setOutputCode(data.translated_code);
      setAnalysis(data.analysis);
      setReviewNote(data.review_note);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setTimeTaken(elapsed);

    } catch (err) {
      setError(err.message);
      setAgentStates(prev => prev.map(a =>
        a.status === "active" ? { status: "error", message: "Failed" } : a
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">

        <div className="header">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            Multi-Agent AI System
            <span className="eyebrow-line" />
          </div>
          <h1>Code Translator</h1>
          <p className="subtitle">
            Four specialist agents collaborate to analyze, convert, and verify your code — instantly.
          </p>
        </div>

        <div className="pipeline-label">Agent pipeline</div>
        <div className="pipeline">
          {AGENTS.map((agent, i) => {
            const s = agentStates[i];
            return (
              <div key={agent.name} className={`agent-card ${s.status}`}>
                <div className="agent-num">{agent.icon}</div>
                <div className="agent-name">{agent.name}</div>
                <div className="agent-role">{agent.role}</div>
                <div className="agent-status-row">
                  <span className="status-dot" />
                  <span className="agent-msg">{s.message}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="examples-row">
          <span className="examples-label">Try</span>
          {EXAMPLES.map(ex => (
            <button key={ex.label} className="ex-btn" onClick={() => loadExample(ex)}>
              {ex.label}
            </button>
          ))}
        </div>

        <div className="controls">
          <div className="lang-group">
            <label>From language</label>
            <select value={fromLang} onChange={e => setFromLang(e.target.value)}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end" }}>
            <button className="swap-btn" onClick={handleSwap}>⇄</button>
          </div>
          <div className="lang-group">
            <label>To language</label>
            <select value={toLang} onChange={e => setToLang(e.target.value)}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="editors">
          <div className="editor-pane">
            <div className="pane-header">
              <div className="pane-title">
                <div className="traffic-lights">
                  <span className="tl tl-r"/><span className="tl tl-y"/><span className="tl tl-g"/>
                </div>
                <span className="pane-lang">SOURCE · {fromLang.toUpperCase()}</span>
              </div>
            </div>
            <textarea
              value={sourceCode}
              onChange={e => setSourceCode(e.target.value)}
              placeholder={`Paste your ${fromLang} code here...`}
            />
          </div>

          <div className="editor-pane">
            <div className="pane-header">
              <div className="pane-title">
                <div className="traffic-lights">
                  <span className="tl tl-r"/><span className="tl tl-y"/><span className="tl tl-g"/>
                </div>
                <span className="pane-lang">OUTPUT · {toLang.toUpperCase()}</span>
              </div>
              {outputCode && (
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? "Copied ✓" : "Copy code"}
                </button>
              )}
            </div>
            <textarea
              value={outputCode}
              readOnly
              placeholder={`${toLang} translation will appear here...`}
            />
          </div>
        </div>

        <button
          className="translate-btn"
          onClick={handleTranslate}
          disabled={loading || !sourceCode.trim() || fromLang === toLang}
        >
          {loading ? "⟳  Agents working..." : "Translate Code →"}
        </button>

        {/* Timer badge */}
        {timeTaken && !loading && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-12px",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 16px",
              borderRadius: "99px",
              background: "rgba(147,112,219,0.1)",
              border: "1px solid rgba(147,112,219,0.25)",
              fontSize: "13px",
              color: "#9370db",
              fontFamily: "'DM Mono', monospace",
            }}>
              ⚡ Completed in {timeTaken}s
            </div>
          </div>
        )}

        {error && <div className="error-box">⚠ {error}</div>}

        {analysis && (
          <div className="result-box">
            <div className="result-label">
              <span className="result-label-dot" />
              Analyzer findings
            </div>
            <div className="result-text">{analysis}</div>
          </div>
        )}

        {reviewNote && (
          <div className={`result-box ${reviewNote.startsWith("OK") ? "review-ok" : "review-improved"}`}>
            <div className="result-label">
              <span className="result-label-dot" />
              Reviewer note
            </div>
            <div className="result-text">{reviewNote}</div>
          </div>
        )}

      </div>
    </>
  );
}