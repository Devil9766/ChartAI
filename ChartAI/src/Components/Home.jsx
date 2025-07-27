import React from "react";
import "./Home.css"
import { Link } from "react-router-dom";

export default function Home(){
    return (
        <>
            <div className="hero">
                <div className="heroInfo">
                    <h1>Smarter Insights from Your Sheets</h1>
                    <p>Get insights from your sheets more easily
                    previously using ChartAI, without writing
                    any formulas or updating charts.</p>
                    <Link className="link span" to="/login" >Get Started</Link>
                </div>
                <div className="heroImg">
                    <img src="/Images/heroProp.png" alt="Home Image" />
                </div>
            </div>
            <section id="features">
                <h2>Why Choose ChartAI?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>📊 Auto-Generated Charts</h3>
                        <p>No need to drag formulas—ChartAI builds charts from your Excel files instantly.</p>
                    </div>
                    <div className="feature-card">
                        <h3>⚡ Fast & Secure</h3>
                        <p>Your data is processed quickly and safely—nothing is stored or shared.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🧠 AI-Powered Insights</h3>
                        <p>Smart suggestions highlight patterns, outliers, and trends in your data.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📥 Easy Upload</h3>
                        <p>Just drag and drop your .xlsx file—no setup, no hassle.</p>
                    </div>
                </div>
            </section>
            <section className="how-it-works">
            <h2>How ChartAI Works</h2>
            <div className="steps">
                <div className="step">
                <span>1</span>
                <h3>Upload Your Excel File</h3>
                <p>Simply drag and drop your Excel sheet or choose a file from your device.</p>
                </div>
                <div className="step">
                <span>2</span>
                <h3>AI Analyzes Your Data</h3>
                <p>Our AI scans your data to detect patterns, trends, and anomalies in seconds.</p>
                </div>
                <div className="step">
                <span>3</span>
                <h3>Get Visual Insights</h3>
                <p>Instantly view interactive charts, summaries, and AI-generated dashboards.</p>
                </div>
            </div>
            </section>

        </>
    )
}