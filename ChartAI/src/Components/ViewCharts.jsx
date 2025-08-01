import React, { useEffect, useState , useRef } from "react";
import "./ViewChart.css";
import { useParams } from "react-router-dom";
import GetInsights from "./GetInsights";
import api from "./api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {Bar,Line,Pie,Doughnut,Radar,PolarArea,Bubble,Scatter} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ViewChart() {
    const {id} = useParams();
    const [chartError , setChartError] = useState("");
    const chartRef = useRef(null);
    const [xAxis , setXAxis] = useState("");
    const [yAxis , setYAxis] = useState("");
    const [chartType , setChartType] = useState("");
    const [sheetHeader , setSheetHeaders] = useState([]);
    const [sheetData, setSheetData] = useState([]);
    const [sheetList, setSheetList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showInsights, setShowInsights] = useState(false);


    useEffect(() => {
        const getSheetList = async () => {
        try {
            const res = await api.get("/api/sheets?file_id="+id);
            setSheetList(res.data);
        } catch (err) {
            if (err.response?.data?.message) {
            setError(err.response.data.message);
            } else {
            setError("Failed to fetch sheet list.");
            }
        } finally {
            setLoading(false);
        }
        };

        getSheetList();
    }, []); 

    const downloadChart = () => {
        const chart = chartRef.current;

        if (!chart){ setChartError("Select a chart first") ; return};

        const originalCanvas = chart.canvas;  
        const scale = 3;  

        const canvas = document.createElement("canvas");
        canvas.width = originalCanvas.width * scale;
        canvas.height = originalCanvas.height * scale;

        const context = canvas.getContext("2d");

        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        context.drawImage(originalCanvas, 0, 0);

        const url = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${chartType || "chart"}-highres.png`;
        link.click();
        setChartError("");
    };

    const handlesheetdata = (item) => {
        const headers = item.columns.split(",").map(h => h.trim());

        let parsed = [];
        try {
            parsed = Array.isArray(item.data_json)
            ? item.data_json
            : JSON.parse(item.data_json || "[]");
        } catch (err) {
            console.error("Invalid JSON in data_json:", err);
        }

        setSheetHeaders(headers);
        setSheetData({ ...item, data_json: parsed });
        setXAxis(" ");
        setYAxis(" ");
        setChartType(" ");

    };

   const parsedData = Array.isArray(sheetData?.data_json) ? sheetData.data_json.filter(
        (item) => item && typeof item === "object" && Object.keys(item).length > 0
        )
    : [];

    const canRenderChart =
    parsedData.length > 0 &&
    xAxis && yAxis ;

    if (loading) return <p className="visualize-container">Loading file history...</p>;
    if (error) return <p className="visualize-container error">{error}</p>;
    if (!sheetList || sheetList.length === 0) return <p className="visualize-container">No uploaded sheets found</p>;

    return (
        <div className="visualize-container">
            <h1>📊 Sheet Visualizer Dashboard</h1>
            <div className="sheet-flex-container">
                <div className="visualize-sidebar">
                    <h5>Sheets : </h5>
                    <ol className="sheet-list">
                        {sheetList.map((sheet, index) => (
                            <li key={index} onClick={()=>handlesheetdata(sheet)} className={`sheet-item ${sheetData.sheet_name === sheet.sheet_name ? "active" : ""}`}>
                            <strong className="clickable">{sheet.sheet_name} </strong> <br />
                            <small>Uploaded on : {new Date(sheet.created_at).toLocaleString()}</small>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="sheet-visualization">
                    <div className="visualization-options">
                        <div className="visual-axis">
                            <p>Select X & Y axis :</p>
                            <div className="axis">
                                <div className="x-axis-zone">
                                    <label htmlFor="x-axis">X-axis: </label>
                                    <select value={xAxis} id="x-axis" onChange={(e)=>setXAxis(e.target.value)}>
                                        <option value="">Select</option>
                                        {sheetHeader.map((item , index)=>(
                                            <option key={index} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div> 
                                <div className="y-axis-zone">
                                    <label htmlFor="y-axis">Y-axis: </label>
                                    <select value={yAxis} id="y-axis" onChange={(e)=>setYAxis(e.target.value)}>
                                        <option value="">Select</option>
                                        {sheetHeader.map((item , index)=>(
                                            <option key={index} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>                             
                        </div>
                        <div className="chart-types">
                            <p><strong>Chart type:</strong></p>
                            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                                <option value="">Select Chart Type</option>
                                <option value="bar">Bar Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="pie">Pie Chart</option>
                                <option value="doughnut">Doughnut Chart</option>
                                <option value="radar">Radar Chart</option>
                                <option value="polarArea">Polar Area Chart</option>
                                <option value="bubble">Bubble Chart</option>
                                <option value="scatter">Scatter Chart</option>
                            </select>
                        </div>
                    </div>
                    <div className="charts-area">
                        {canRenderChart ? (
                        <>
                            {chartType === "bar" && (
                            <Bar
                                ref={chartRef}
                                data={{
                                labels: parsedData.map(d => d[xAxis]),
                                datasets: [{
                                    label: yAxis,
                                    data: parsedData.map(d => d[yAxis]),
                                    backgroundColor: "rgba(75,192,192,0.6)",
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "line" && (
                            <Line
                                ref={chartRef}
                                data={{
                                labels: parsedData.map(d => d[xAxis]),
                                datasets: [{
                                    label: yAxis,
                                    data: parsedData.map(d => d[yAxis]),
                                    fill: false,
                                    borderColor: "rgba(75,192,192,1)"
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "pie" && (
                            <Pie
                                ref={chartRef}
                                data={{
                                labels: parsedData.map(d => d[xAxis]),
                                datasets: [{
                                    data: parsedData.map(d => d[yAxis]),
                                    backgroundColor: [
                                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"
                                    ]
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "doughnut" && (
                            <Doughnut
                                ref={chartRef}
                                data={{
                                labels: parsedData.map(d => d[xAxis]),
                                datasets: [{
                                    data: parsedData.map(d => d[yAxis]),
                                    backgroundColor: [
                                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"
                                    ]
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "radar" && (
                            <Radar
                                ref={chartRef}
                                data={{
                                labels: parsedData.map(d => d[xAxis]),
                                datasets: [{
                                    label: yAxis,
                                    data: parsedData.map(d => d[yAxis]),
                                    backgroundColor: "rgba(75,192,192,0.2)",
                                    borderColor: "rgba(75,192,192,1)"
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "polarArea" && (
                            <PolarArea
                                ref={chartRef}
                                data={{
                                labels: parsedData.map(d => d[xAxis]),
                                datasets: [{
                                    data: parsedData.map(d => d[yAxis]),
                                    backgroundColor: [
                                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"
                                    ]
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "bubble" && (
                            <Bubble
                                ref={chartRef}
                                data={{
                                datasets: [{
                                    label: yAxis,
                                    data: parsedData.map(d => ({
                                    x: d[xAxis],
                                    y: d[yAxis],
                                    r: Math.random() * 10 + 5  // use real value if available
                                    })),
                                    backgroundColor: "rgba(54, 162, 235, 0.5)"
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}

                            {chartType === "scatter" && (
                            <Scatter
                                ref={chartRef}
                                data={{
                                datasets: [{
                                    label: yAxis,
                                    data: parsedData.map(d => ({
                                    x: d[xAxis],
                                    y: d[yAxis]
                                    })),
                                    backgroundColor: "rgba(255, 99, 132, 0.5)"
                                }]
                                }}
                                options={{ responsive: true }}
                            />
                            )}
                            {canRenderChart && (
                            <button onClick={downloadChart} className="download-btn">
                                ⬇️ Download Chart
                            </button>
                            
                            )}
                        </>
                        ) : <p>Please select valid X and Y axis with matching numeric data.</p>}
                        <br />
                        <span style={{color : "red"}}>{chartError}</span>
                    </div>
                </div>
            </div>
            {canRenderChart && !showInsights && (
            <button className="insight-btn" style={{visibility : !showInsights ? "visible" : "hidden"}} onClick={() => setShowInsights(true)}>
                🤖 Generate Insights
            </button>
            )}

            {showInsights && (
            <GetInsights
                sheetData={sheetData}
                chartConfig={{
                chartType,
                xAxis,
                yAxis,
                data: parsedData
                }}
                onClose={() => setShowInsights(false)}
            />
            )}
        </div>
    );
    }
