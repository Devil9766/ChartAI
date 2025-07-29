import React, { useEffect, useState } from "react";
import "./ViewChart.css";
import { useParams } from "react-router-dom";
import api from "./api";

export default function ViewChart() {
    const {id} = useParams();
    const[sheetHeader , setSheetHeaders] = useState([]);
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

    const handlesheetdata = (item)=>{
        setSheetHeaders(item.columns.split(","));
        setSheetData(item);
    }
   
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
                                    <select name="X-axis" id="x-axis">
                                        <option value="">Select</option>
                                        {sheetHeader.map((item , index)=>(
                                            <option key={index} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div> 
                                <div className="y-axis-zone">
                                    <label htmlFor="y-axis">Y-axis: </label>
                                    <select name="Y-axis" id="y-axis">
                                        <option value="">Select</option>
                                        {sheetHeader.map((item , index)=>(
                                            <option key={index} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>                             
                        </div>
                        <div className="chart-types">
                            <p>chart types:</p>
                        </div>
                    </div>
                    <div className="charts-area">
                        <h3>charts</h3>
                    </div>
                </div>

            </div>
        </div>
    );
    }
