import React, { useEffect, useState } from "react";
import "./Navbar.css"
import {Link, useNavigate} from "react-router-dom";
import api from "./api";
import { useAuth } from "./Context/AuthContext";

export default function Navbar(){
    const {user , loading, setUser} = useAuth();
    const [userRole , setUserRole] = useState();
    const nav  = useNavigate();

    const isLoggedIn =user? true : false;

    const handleLogout = async ()=>{
        try {
            await api.post("/logout");
            setUserRole(null);
            setUser(null)
            nav("/login");
        } catch (error) {
            console.log("Logout failed : ",error)
        }
        
    }
     useEffect(()=>{
        const getRole = async()=>{
        try {
            const res =await api.get("/profile");
            const role = res.data.role;
            setUserRole(role);
            } catch (error) {
            setUserRole(null);
            setUser(null);
            }
        }

        if(isLoggedIn){
            getRole();
        }
    } , [isLoggedIn]);


    
    if (loading) return null; 

        return (
        <div className="navbar">
            <div className="navIcon">
            <Link to="/"><img src="/Images/chartai.png" alt="ChartAI Logo" /></Link>
            </div>
            <div className="navOptions">
            <Link className="link" to="/">Home</Link>
            <Link className="link" to="/docs">Docs</Link>

            {userRole === "admin" && <Link className="link" to="/admin-dashboard">Admin Dashboard</Link>}
            {userRole === "user" && <Link className="link" to="/user-dashboard">User Dashboard</Link>}

            {user ? (
                <button className="logout link" onClick={handleLogout}>Logout</button>
            ) : (
                <Link className="link span" to="/login">Get Started</Link>
            )}
            </div>
        </div>
        );

}