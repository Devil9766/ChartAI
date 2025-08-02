import React, { useEffect, useState } from "react";
import api from "./api";
import {
  Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble,
} from "react-chartjs-2";
import "./ViewReports.css";

const chartMap = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polararea: PolarArea,
  scatter: Scatter,
  bubble: Bubble,
};

export default function ViewReports({ userId }) {
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [visualizations, setVisualizations] = useState({}); 

  useEffect(() => {
  api.get("/reports")
    .then((res) => setReports(res.data))
    .catch((err) => console.error("Failed to fetch reports", err));
}, []);

const toggleReport = async (report) => {
  if (expanded === report.report_id) {
    setExpanded(null);
    return;
  }

  try {
    const res = await api.get(`/report/${report.report_id}`);
    setVisualizations((prev) => ({
      ...prev,
      [report.report_id]: res.data.visualizations,
    }));
    setExpanded(report.report_id);
  } catch (error) {
    console.error("Failed to load report details", error);
  }
};

const renderChart = (viz, index) => {
  const type = viz.type?.toLowerCase();
  const ChartComponent = chartMap[type];

  if (!ChartComponent) return <p key={index}>❌ Unsupported chart type: {viz.type}</p>;

  if (!viz.config_json) return <p key={index}>❌ Missing chart config</p>;

  let config = {};
  try {
  config = typeof viz.config_json === "string" ? JSON.parse(viz.config_json) : viz.config_json;
  console.log("Parsed config for", viz.title, config);
} catch (e) {
  console.error("Invalid JSON in chart config:", viz.config_json);
  return <p key={index}>❌ Invalid JSON in chart config</p>;
}

if (!config?.data?.datasets) {
  console.warn("Incomplete data for:", viz.title, config);
  return <p key={index}>❌ Incomplete chart data</p>;
}

  return (
    <div className="chart-container" key={index}>
      <h4>{viz.title}</h4>
      <ChartComponent data={config.data} options={config.options || {}} />
    </div>
  );
};


  return (
    <div className="view-reports">
      <h2>📊 Your Analysis Reports</h2>

      {reports.length === 0 && <p>No reports found.</p>}

        {reports.map((report) => (
            <div key={report.report_id} className="report-card">
          <div className="report-header">
            <h3>{report.title}</h3>
            <p><b>Created:</b> {new Date(report.created_at).toLocaleString()}</p>
            <button onClick={() => toggleReport(report)}>
              {expanded === report.report_id ? "Hide Details" : "View Details"}
            </button>
          </div>

          {expanded === report.report_id && (
            <div className="report-details">
              <p><b>Summary:</b> {report.summary}</p>
              <div className="json-preview">
                <strong>Report JSON:</strong>
                <pre>{JSON.stringify(report.report_json, null, 2)}</pre>
              </div>

              <h4>🖼️ Visualizations</h4>
              {visualizations[report.report_id]?.length > 0 ? (
                visualizations[report.report_id].map((viz, index) =>
                    renderChart(viz , index)
                    )
              ) : (
                <p>No visualizations available.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
