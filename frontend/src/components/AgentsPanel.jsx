const AGENTS = [
  { name: "Orchestrator", role: "Route & validate" },
  { name: "Analyzer",     role: "Parse & understand" },
  { name: "Translator",   role: "Convert language" },
  { name: "Reviewer",     role: "Verify & improve" },
];

const STATE_COLORS = {
  idle:    { border: "#e5e7eb", dot: "#d1d5db", text: "#9ca3af" },
  active:  { border: "#3b82f6", dot: "#3b82f6", text: "#2563eb" },
  done:    { border: "#10b981", dot: "#10b981", text: "#059669" },
  error:   { border: "#ef4444", dot: "#ef4444", text: "#dc2626" },
};

export default function AgentPanel({ agentStates }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
      {AGENTS.map((agent, i) => {
        const state = agentStates[i] || { status: "idle", message: "Waiting" };
        const colors = STATE_COLORS[state.status];

        return (
          <div key={agent.name} style={{
            border: `1px solid ${colors.border}`,
            borderRadius: "10px", padding: "12px",
            transition: "border-color 0.3s"
          }}>
            {/* Dot */}
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: colors.dot, marginBottom: "8px",
              animation: state.status === "active" ? "pulse 1s infinite" : "none"
            }} />

            <div style={{ fontSize: "12px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>
              {agent.name}
            </div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>
              {agent.role}
            </div>
            <div style={{ fontSize: "11px", color: colors.text }}>
              {state.message}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}