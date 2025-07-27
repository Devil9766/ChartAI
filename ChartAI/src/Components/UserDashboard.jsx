import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import api from "./api";
export default function UserDashboard(){
    const [dataFile , setDataFile] = useState();

    const [ user ,  setUser] = useState();
    useEffect(()=>{
        const getName = async () =>{
        try {
            const res = await api.get("/profile" );
            setUser(res.data.name);
        }catch (error) {
            console.log("Error while fetching User" , error);
        }
        } 
        
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
        formData.append("file" , dataFile);

        try {
            const res = await api.post("/upload" , formData , {
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            });
            alert("File uploaded successfully");
        } catch (error) {
            console.log("Upload fail" , error)
            alert("Upload failed");
        }
    }
    return(
        <div className="user-dashboard">
            <h1>Welcome Back {user} 👋</h1>
            <div className="upload-section">
                <h5 className="upload-label">Upload an Excel or CSV file analyze</h5>
                <div className="inputFileName">
                    <label htmlFor="file-upload" className="custom-file-upload">Select File</label>
                    <input type="file" id="file-upload" onChange={handleFileChange} />
                    {dataFile && <p className="file-name">Selected file: {dataFile.name}</p>}
                </div>
                <button onClick={handleUpload} className="upload-btn">Upload</button>
            </div>
        </div>
    )
}