import React, { useEffect, useState , useRef } from "react";
import "./ViewChart.css";
import { useParams } from "react-router-dom";
import api from "./api";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);


export default function ViewChart() {
    const {id} = useParams();

    const chartRef = useRef(null);
    const [xAxis , setXAxis] = useState("");
    const [yAxis , setYAxis] = useState("");
    const [chartType , setChartType] = useState("");
    const [sheetHeader , setSheetHeaders] = useState([]);
    const [sheetData, setSheetData] = useState([]);
    const [sheetList, setSheetList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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

        if (!chart) return;

        const originalCanvas = chart.canvas;  // Chart.js v4
        const scale = 3;  // increase scale for higher quality

        const canvas = document.createElement("canvas");
        canvas.width = originalCanvas.width * scale;
        canvas.height = originalCanvas.height * scale;

        const context = canvas.getContext("2d");

        // Ensure sharp text rendering
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        // Draw the original chart at higher resolution
        context.drawImage(originalCanvas, 0, 0);

        // Convert to data URL and trigger download
        const url = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${chartType || "chart"}-highres.png`;
        link.click();
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

        console.log("Parsed data after selection:", parsed);

        setSheetHeaders(headers);
        setSheetData({ ...item, data_json: parsed });

        
    };

   const parsedData = Array.isArray(sheetData?.data_json) ? sheetData.data_json.filter(
        (item) => item && typeof item === "object" && Object.keys(item).length > 0
        )
    : [];

    const isValidKey = (key) =>
    key &&
    parsedData.length > 0 &&
    parsedData.every(item => 
        typeof item === "object" &&
        item !== null &&
        Object.prototype.hasOwnProperty.call(item, key) &&
        item[key] !== null &&
        item[key] !== undefined
    );

    const canRenderChart =
    parsedData.length > 0 &&
    xAxis && yAxis &&
    isValidKey(xAxis) &&
    isValidKey(yAxis);

    console.log("Parsed data:", parsedData);
    console.log("xAxis:", xAxis);
    console.log("yAxis:", yAxis);
    console.log("isValidKey(xAxis):", isValidKey(xAxis));
    console.log("isValidKey(yAxis):", isValidKey(yAxis));
    console.log("canRenderChart:", canRenderChart);
   
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
                                <option value="">Select</option>
                                <option value="bar">Bar Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="pie">Pie Chart</option>
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
                        {canRenderChart && (
                        <button onClick={downloadChart} className="download-btn">
                            ⬇️ Download Chart
                        </button>
                        )}
                        </>
                        ) : <p>Please select valid X and Y axis with matching numeric data.</p>}
                    </div>
                </div>

            </div>
        </div>
    );
    }
