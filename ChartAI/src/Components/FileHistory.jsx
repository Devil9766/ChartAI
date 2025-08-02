import {useState , useEffect} from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./FileHistory.css";

export default function FileHistory(props){
    const [fileHistory , setFileHistory] = useState([]);
    const [loading , setLoading] = useState(true);
    const [showPopup , setShowPopup ] = useState(false)
    const [error , setError] = useState("");
    const nav = useNavigate();

    useEffect(()=>{
        const getFileHistory = async ()=>{
            try {
                const result = await api.get("/api/file-history");
            setFileHistory(result.data);
            } catch (error) {
                if(error.response?.data?.message){
                    setError(error.response.data.message);
                }else{
                    setError("Error fetching file history");
                }
                 console.error("Failed to fetch file history:", error);
            }finally{
                setLoading(false);
            }
        };
        getFileHistory();
    } , [])
    const handleFileClick = (fileId) =>{
        nav(`/visualize/${fileId}`);
    };

    const handleClick = ()=>{

    }

    if(loading) return <p>Loading file history.... </p>
    if(error) return <p className="error">{error}</p>
    if(!fileHistory || fileHistory.length ===0) return <p>No uploaded files found</p>


    return(
        <section className="file-history">
            <h3>Your Recently Uploaded Files :</h3>
            <div className="file-history-list">
                <ul>
                    {fileHistory.slice(0, 3).map((file, index) => (
                        <li key={index} className="file-item" onClick={() => handleFileClick(file.file_id)}>
                        <strong className="clickable">{file.filename}</strong> <br />
                        <small>Uploaded on : {new Date(file.uploaded_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
                <p className="history-btn" onClick={()=>setShowPopup(true)}>view full history</p>                
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Full history :</h3>
                        <div className="full-file-history">
                            <ul>
                                {fileHistory.map((item , index)=>(
                                    <li key={index} className="file-item" onClick={()=>handleFileClick(item.file_id)}>
                                        <strong className="clickable">{item.filename}</strong> <br />
                                        <small>Uploaded on : {new Date(item.uploaded_at).toLocaleString()}</small>
                                    </li>
                                ))}  
                            </ul>                
                        </div>
                        <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            <div className="view-reports-btn">
                <button onClick={()=>nav("/reports")}>View Reports</button>
            </div>
        </section>
    );
}