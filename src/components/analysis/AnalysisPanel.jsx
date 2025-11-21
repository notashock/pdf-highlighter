function Ref({ num, onClick }) {
  return (
    <span
      className="text-blue-600 underline cursor-pointer ml-1"
      onClick={() => onClick(num)}
    >
      [{num}]
    </span>
  );
}

export default function AnalysisPanel({ onRefClick }) {
  return (
    <div className="leading-relaxed text-[16px] p-6">
      <h2 className="text-xl font-semibold mb-4">Analysis</h2>

      <p className="mb-4">
        No extraordinary or one-off items affecting EBITDA were reported in Maersk’s
        Q2 2025 results. The report explicitly notes that EBITDA improvements stemmed
        from operational performance— including volume growth, cost control, and margin
        improvement across Ocean, Logistics & Services, and Terminals segments
        <Ref num={1} onClick={onRefClick} />
        <Ref num={2} onClick={onRefClick} />.
      </p>

      <p className="mb-6">
        Gains or losses from asset sales, which could qualify as extraordinary items,
        are shown separately under EBIT and not included in EBITDA. The gain on sale of
        non-current assets was USD 25 m in Q2 2025, significantly lower than USD 208 m
        in Q2 2024, but these affect EBIT, not EBITDA
        <Ref num={3} onClick={onRefClick} />.
      </p>

      <h3 className="text-lg font-medium mb-3">Findings</h3>

      <p className="mb-3">
        <strong>Page 3 — Highlights Q2 2025:</strong> EBITDA increase attributed to operational
        improvements. <Ref num={1} onClick={onRefClick} />
      </p>

      <p className="mb-3">
        <strong>Page 5 — Review Q2 2025:</strong> EBITDA rise driven by higher revenue and
        cost control. <Ref num={2} onClick={onRefClick} />
      </p>

      <p className="mb-3">
        <strong>Page 15 — Condensed Income Statement:</strong> Gain on sale of non-current
        assets USD 25 m (vs 208 m). <Ref num={3} onClick={onRefClick} />
      </p>
    </div>
  );
}
