import React, { useEffect, useState } from "react";
import api from "./api";
import {
  Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble,
} from "react-chartjs-2";
import "./ViewReports.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));


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

const exportToPNG = async (reportId) => {
  const element = document.getElementById(`report-${reportId}-content`);
  if (!element) return;

  try {
    await delay(500); 
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `report-${reportId}.png`;
    link.click();
  } catch (err) {
    console.error("Failed to export PNG", err);
  }
};

    const exportToPDF = async (reportId) => {
      const element = document.getElementById(`report-${reportId}-content`);
      if (!element) return;

      try {
        await delay(500); // Wait for chart render
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pageHeight - 20) {
          let position = 10;
          let page = 1;
          let remainingHeight = imgHeight;
          while (remainingHeight > 0) {
            if (page > 1) pdf.addPage();
            const cropHeight = Math.min(remainingHeight, pageHeight - 20);
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, cropHeight);
            remainingHeight -= cropHeight;
            position = 10;
            page++;
          }
        } else {
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        }

        pdf.save(`report-${reportId}.pdf`);
      } catch (err) {
        console.error("Failed to export PDF", err);
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
    } catch (e) {
      console.error("Invalid JSON in chart config:", viz.config_json);
      return <p key={index}>❌ Invalid JSON in chart config</p>;
    }

    if (!config?.data?.datasets) {
      console.warn("Incomplete data for:", viz.title, config);
      return <p key={index}>❌ Incomplete chart data</p>;
    }

    return (
    <div className="chart-container" key={index} style={{ height: '300px', width: '100%' }}>
      <h4>{viz.title}</h4>
      <ChartComponent
        data={config.data}
        options={{ ...config.options, responsive: true, maintainAspectRatio: false }}
      />
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
              <div id={`report-${report.report_id}-content`} className="exportable-report">
                <p><b>Summary:</b> {report.summary}</p>

                <h4>🖼️ Visualizations</h4>
                {visualizations[report.report_id]?.length > 0 ? (
                  visualizations[report.report_id].map((viz, index) =>
                    renderChart(viz, index)
                  )
                ) : (
                  <p>No visualizations available.</p>
                )}
              </div>

              <div className="export-buttons">
                <button onClick={() => exportToPDF(report.report_id)}>Export PDF</button>
                <button onClick={() => exportToPNG(report.report_id)}>Export PNG</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
