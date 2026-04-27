const LANGUAGES = [
  "Perl", "Python", "JavaScript", "TypeScript",
  "Java", "C++", "Ruby", "Go", "Bash", "SQL"
];

export default function CodeEditor({
  sourceCode, setSourceCode,
  outputCode, fromLang, setFromLang,
  toLang, setToLang, onTranslate, loading
}) {

  const handleSwap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    if (outputCode) setSourceCode(outputCode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Language selectors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "end" }}>
        <div>
          <label style={labelStyle}>From</label>
          <select
            value={fromLang}
            onChange={e => setFromLang(e.target.value)}
            style={selectStyle}
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <button onClick={handleSwap} style={swapStyle} title="Swap languages">
          ⇄
        </button>

        <div>
          <label style={labelStyle}>To</label>
          <select
            value={toLang}
            onChange={e => setToLang(e.target.value)}
            style={selectStyle}
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Code panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={labelStyle}>Source Code</label>
          <textarea
            value={sourceCode}
            onChange={e => setSourceCode(e.target.value)}
            placeholder="Paste your code here..."
            style={textareaStyle}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={labelStyle}>Translated Code</label>
            {outputCode && (
              <button onClick={handleCopy} style={copyStyle}>Copy</button>
            )}
          </div>
          <textarea
            value={outputCode}
            readOnly
            placeholder="Translation will appear here..."
            style={{ ...textareaStyle, background: "#f9fafb", cursor: "default" }}
          />
        </div>
      </div>

      {/* Translate button */}
      <button
        onClick={onTranslate}
        disabled={loading || !sourceCode.trim() || fromLang === toLang}
        style={{
          ...btnStyle,
          opacity: (loading || !sourceCode.trim() || fromLang === toLang) ? 0.5 : 1
        }}
      >
        {loading ? "Translating..." : "Translate Code ↗"}
      </button>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────
const labelStyle = {
  display: "block", fontSize: "11px", color: "#6b7280",
  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px"
};
const selectStyle = {
  width: "100%", padding: "8px 10px", borderRadius: "8px",
  border: "1px solid #4b5563", fontSize: "13px",
  background: "#1f2937", color: "white"
};
const swapStyle = {
  width: "36px", height: "36px", borderRadius: "8px",
  border: "1px solid #4b5563", background: "#1f2937",
  cursor: "pointer", fontSize: "16px", marginBottom: "0px"
};
const textareaStyle = {
  width: "100%", height: "220px", padding: "10px 12px",
  fontFamily: "monospace", fontSize: "12px", lineHeight: "1.6",
  border: "1px solid #e5e7eb", borderRadius: "8px",
  resize: "vertical", boxSizing: "border-box"
};
const btnStyle = {
  width: "100%", padding: "10px", fontSize: "14px",
  fontWeight: "500", cursor: "pointer", borderRadius: "8px",
  border: "1px solid #e5e7eb", background: "#111827",
  color: "white", transition: "opacity 0.15s"
};
const copyStyle = {
  fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
  border: "1px solid #e5e7eb", background: "white", cursor: "pointer"
};