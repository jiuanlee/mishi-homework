# Evolution Narrative

A chronological record of evolution decisions and outcomes.

### [2026-03-07 10:05:27] REPAIR - failed
- Gene: gene_gep_repair_from_errors | Score: 0.20 | Scope: 0 files, 0 lines
- Signals: [log_error, repeated_tool_usage:exec]
- Strategy:
  1. Extract structured signals from logs and user instructions
  2. Select an existing Gene by signals match (no improvisation)
  3. Estimate blast radius (files, lines) before editing
