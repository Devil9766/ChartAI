import React, { useEffect, useState } from "react";
import api from "./api";
import "./GetInsights.css"; // optional for external CSS styling

export default function GetInsights({ sheetData, chartConfig, onClose }) {
  const [insight, setInsight] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // for loading state

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const res = await api.post("/api/generate-insight", {
          sheetData: sheetData.data_json,
        });
        setInsight(res.data.insight || "No insight generated.");
      } catch (err) {
        setInsight("Error generating insight.");
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [sheetData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const reportRes = await api.post("/save-report", {
        data_id: sheetData.data_id,
        title: `Insight on ${sheetData.sheet_name}`,
        summary: insight,
        report_json: { insight },
      });

      const report_id = reportRes.data.report_id;

      await api.post("/save-viz", {
        report_id,
        title: `Chart on ${sheetData.sheet_name}`,
        type: chartConfig.chartType,
        config_json: chartConfig,
      });

      onClose(); // close insight view
    } catch (err) {
      console.error("Error saving insight:", err);
    }
    setSaving(false);
  };

  return (
    <div className="get-insights">
      <h3>📈 Insight Report</h3>
      {loading ? (
        <div className="spinner-container">
          <svg
            className="spinner"
            viewBox="0 0 50 50"
          >
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
          </svg>
          <p>Generating insight...</p>
        </div>
      ) : (
        <>
          <p>{insight}</p>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save to Database"}
          </button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            ❌ Close
          </button>
        </>
      )}
    </div>
  );
}
