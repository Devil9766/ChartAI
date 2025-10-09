import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404 🚫</h1>
      <p className="notfound-message">Oops! The page you're looking for doesn't exist.</p>
      <button className="notfound-button" onClick={() => navigate("/")}>
        🔙 Go Home
      </button>
    </div>
  );
}
