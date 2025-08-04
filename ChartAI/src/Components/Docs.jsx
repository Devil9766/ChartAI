import React from "react";
import "./Docs.css";

export default function Docs() {
  return (
    <div className="docs-container">
      <h1 className="docs-title">📘 ChartAI Documentation</h1>
      
      <section className="docs-section">
        <h2>🔍 What is ChartAI?</h2>
        <p>
          <strong>ChartAI</strong> is a smart Excel analytics platform that enables users to:
          <ul>
            <li>Upload Excel spreadsheets (XLS/XLSX)</li>
            <li>Automatically extract and structure data</li>
            <li>Generate AI-driven insights and summaries</li>
            <li>Create professional visualizations (Bar, Line, Pie, etc.)</li>
            <li>Export reports as PDF or PNG</li>
          </ul>
        </p>
      </section>

      <section className="docs-section">
        <h2>🚀 Getting Started</h2>
        <ol>
          <li><strong>Create an Account:</strong> Sign up using your email and password.</li>
          <li><strong>Login:</strong> Access your dashboard upon successful login.</li>
          <li><strong>Upload File:</strong> Upload your Excel file under the User Dashboard.</li>
          <li><strong>Explore Charts:</strong> Click on any uploaded file to visualize or analyze.</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>📈 Features</h2>
        <ul>
          <li><strong>Data Extraction:</strong> Parses all sheets and structures the data.</li>
          <li><strong>AI Insights:</strong> Get automatic summaries and interpretation using AI.</li>
          <li><strong>Interactive Charts:</strong> Render dynamic charts using Chart.js.</li>
          <li><strong>Export Options:</strong> Download insights and charts as PDF or PNG.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>🛡️ Roles and Access</h2>
        <ul>
          <li><strong>User:</strong> Can upload files, generate insights, and manage personal data.</li>
          <li><strong>Admin:</strong> Can manage users, view global stats, and moderate reports.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>🧰 Tech Stack</h2>
        <ul>
          <li><strong>Frontend:</strong> React + Chart.js + Axios</li>
          <li><strong>Backend:</strong> Node.js + Express</li>
          <li><strong>Database:</strong> MySQL (via Sequelize / DB queries)</li>
          <li><strong>File Parsing:</strong> xlsx, html2canvas, jspdf</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>📂 Folder Structure</h2>
        <pre>
          /ChartAI
          ├── /Components
          │   ├── UserDashboard.jsx
          │   ├── AdminDashboard.jsx
          │   ├── ViewChart.jsx
          │   ├── GetInsights.jsx
          ├── /assets
          ├── /Context
          │   └── AuthContext.js
          ├── api.js
          └── App.jsx
        </pre>
      </section>

      <section className="docs-section">
        <h2>❓ Need Help?</h2>
        <p>
          If you encounter any issues or have suggestions, feel free to contact our support team or create a GitHub issue (if open-sourced).
        </p>
      </section>
    </div>
  );
}
