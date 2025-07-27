import React, { useEffect, useState } from "react";
import "./Navbar.css"
import {Link, useNavigate} from "react-router-dom";
import api from "./api";

export default function Navbar(){
    const [userRole , setUserRole] = useState();
    const userLoggedIn = !!sessionStorage.getItem("isLoggedIn")
    const nav  = useNavigate();
    const handleLogout = async ()=>{
        try {
            await api.post("/logout");
            setUserRole(null);
            sessionStorage.removeItem("isLoggedIn");
            nav("/login");
        } catch (error) {
            console.log("Logout failed : ",error)
        }
        
    }
     useEffect(()=>{
        if(userLoggedIn){
        const getRole = async()=>{
        try {
            const res =await api.get("/profile");
            const role = res.data.role;
            setUserRole(role);
            } catch (error) {
            setUserRole(null);
            sessionStorage.removeItem("isLoggedIn");
           
        }
    }
    getRole();
    }
    
    } , [userLoggedIn , nav]);


    
    return (
        <div className="navbar">
            <div className="navIcon">
            <Link to="/"><img src="/Images/chartai.png" alt="ChartAI Logo" /></Link>
            </div>
            <div className="navOptions">
                <Link className="link" to="/" >Home</Link>
                <Link className="link" to="/pricing" >Pricing</Link>
                <Link className="link" to="/docs" >Docs</Link>
                {userRole === "admin" && <Link className="link" to="/admin-dashboard" >Admin Dashboard</Link>}
                {userRole === "user" && <Link className="link" to="/user-dashboard" >User Dashboard</Link>}
                { userLoggedIn ? 
                    (<button className="logout" onClick={handleLogout}>Logout</button>)
                :
                    (<Link className="link span" to="/login" >Get Started</Link>)
                    }
            </div>
        </div>
    );
}