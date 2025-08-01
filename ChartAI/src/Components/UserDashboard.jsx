import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import api from "./api";
import { useNavigate } from "react-router-dom";
import FileHistory from "./FileHistory";

export default function UserDashboard(){

    const nav = useNavigate();
    const [stats , setStats] = useState({});
    const [dataFile , setDataFile] = useState();
    const [ user ,  setUser] = useState();
    const [error , setError] = useState();
    useEffect(()=>{
        const getName = async () =>{
        try {
            const res = await api.get("/profile" );
            setUser(res.data.name);
        }catch (error) {
            console.log("Error while fetching User" , error);
        }
        } 

       const getStats = async()=>{ 
        try {
            const stats = await api.get("/stats");
            setStats(stats.data)
        } catch (error) {
            setError("error while getting stats")
        }
        }
        getStats();
        getName();
        
    } , []);

    const handleFileChange = (e)=>{
        const file = e.target.files[0]
        if(file){
            setDataFile(file);
        }
    };

    const handleUpload = async ()=>{
        if(!dataFile) return alert("No file Selected.")

        const formData = new FormData();
        formData.append("DataFile" , dataFile);

        try {
            const res = await api.post("/api/upload" , formData , {
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            });
            alert("File uploaded successfully");
            nav(`/visualize/${res.data.fileId}`);
        } catch (error) {
            if(error.response?.data?.message){
                setError(error.response.data.message)
            }
            alert("Upload failed");
        }
    }
    return(
        <div className="user-dashboard">
            <h1>Welcome Back {user} 👋</h1>
            <div className="file-grid-container">
                <div className="upload-section">
                    <div className="file-upload-section">
                        <h5 className="upload-label">Upload an Excel or CSV file analyze</h5>
                        <div className="inputFileName">
                            <label htmlFor="file-upload" className="custom-file-upload">Select File</label>
                            <input type="file" id="file-upload" onChange={handleFileChange} />
                            {dataFile && <p className="file-name">Selected file: {dataFile.name}</p>}
                        </div>
                        <button onClick={handleUpload} className="upload-btn">Upload</button>
                        <span style={{color : "red"}}>{error}</span>
                    </div>
                    <div className="file-widgets">
                        <div className="count-block">
                            <p>Total Files : </p>
                            <p className="count">  {stats.file_count}</p>
                        </div>
                        <div className="count-block">
                            <p>Total Sheets : </p>
                            <p className="count">  {stats.sheet_count}</p>
                        </div>
                        <div className="count-block">
                            <p>Total Insights : </p>
                            <p className="count">  {stats.total_insights}</p>
                        </div>
                        <div className="count-block">
                            <p>Saved Visuals: </p>
                            <p className="count">  {stats.visualization_saved_count}</p>
                        </div>
                    </div>
                </div>
                <FileHistory />
            </div>
        </div>
    )
}