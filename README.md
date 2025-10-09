📊 ChartAI – Smart Excel Analytics Platform

ChartAI is a full-stack web application that empowers users to upload Excel files, visualize data using dynamic charts, and receive AI-powered insights in natural language. Designed for ease of use and business intelligence, ChartAI transforms raw spreadsheet data into meaningful visuals and reports using Cohere AI and Chart.js.

[🔗 Live Demo](https://chart-ai.vercel.app/) | [📂 Backend Repo](https://github.com/Devil9766/ChartAI)

---

## 🚀 Features

- 📁 Upload Excel (.xlsx) files and convert them into JSON.
- 📊 Generate dynamic **Bar**, **Line**, and **Pie** charts with **Chart.js**.
- 🧠 Get real-time **AI insights** using **Cohere AI** based on uploaded data.
- 📄 Export visualizations and insights as **PDF reports**.
- 👤 Role-based dashboards for **Users** and **Admins**.
- 🔐 Secure login with session management using `Context API`.
- 📜 View file history, report archive, and insight summaries.
- 🌐 Deployed on **Vercel (frontend)** and **Render (backend)**.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Chart.js (via `react-chartjs-2`)
- HTML5, CSS3, JavaScript
- Axios

**Backend:**
- Node.js
- Express.js
- Cohere AI (text generation for insights)
- MySQL (data storage for reports and visualizations)

**Tools & Deployment:**
- Git & GitHub
- RESTful APIs
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

---

## 📸 Screenshots

> *(Add your screenshots here – dashboard, chart view, insights popup, etc.)*

---

## 📦 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/Devil9766/ChartAI.git
cd ChartAI
2. Install Dependencies
Frontend:
bash
Copy
Edit
cd client
npm install
Backend:
bash
Copy
Edit
cd server
npm install
3. Environment Variables
Create a .env file in the server directory:

env
Copy
Edit
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_password
DB_NAME=chartai
COHERE_API_KEY=your_cohere_api_key
4. Run the App
Backend:
bash
Copy
Edit
cd server
npm start
Frontend:
bash
Copy
Edit
cd client
npm start
📁 Folder Structure
bash
Copy
Edit
ChartAI/
├── client/         # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
├── server/         # Express backend
│   ├── routes/
│   ├── controllers/
│   └── db.js
├── README.md
└── package.json
✅ Roadmap
 Excel Upload and JSON Conversion

 Chart Rendering (Bar, Line, Pie)

 Cohere AI Integration for Insights

 PDF Export

 File & Report History

 Chart customization options

 Multi-user collaboration

🙌 Acknowledgements
Cohere AI

Chart.js

React

Vercel

Render

📬 Contact
Hrishi Sharma
📧 LinkedIn https://www.linkedin.com/in/hrishi-sharma9766/
📁 Portfolio https://hrishi-portfolio.onrender.com/

Made with 💡 and ☕ by Hrishi Sharma
