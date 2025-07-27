import React, { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer(){
    const [ currentTime , setCurrentTime] = useState("");

    const changeTime = () =>{
        const time = new Date();
        const formattedTime = new Intl.DateTimeFormat("en-Us", {
        timeZone : "Asia/Kolkata",
        timeStyle :"full",
    }).format(time);
        setCurrentTime(formattedTime);
    }

    useEffect(()=>{
         setInterval(changeTime , 1000);
        
    },[]);
    
    return(
    
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-brand">
            <h3>ChartAI</h3>
            <p>Smarter insights from your sheets.</p>
            </div>

            <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
            </div>

            <div className="footer-socials">
            <a href="https://www.google.com"><i className="fab fa-twitter">Google</i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
            </div>
        </div>

        <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ChartAI. All rights reserved. <span>{currentTime}</span></p>
        </div>
    </footer>

    )
}