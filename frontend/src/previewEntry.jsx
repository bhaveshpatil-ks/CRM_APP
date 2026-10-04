import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <div style={{
    minHeight: "100vh",
    backgroundColor: "#f0f0f2",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 10px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
  }}>
    <div style={{
      marginBottom: "16px",
      textAlign: "center"
    }}>
      <div style={{
        display: "inline-block",
        background: "#000000",
        color: "#ffffff",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        marginBottom: "8px"
      }}>
        GROQ 1.4s • ON-DEVICE STORAGE
      </div>
      <h2 style={{ color: "#000000", margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", letterSpacing: "-0.4px" }}>
        Android Call Intelligence
      </h2>
      <p style={{ color: "#8e8e93", margin: 0, fontSize: "12px" }}>
        Minimal Premium Navigation &amp; Productivity-First Design
      </p>
    </div>

    {/* Phone Mockup Frame */}
    <div style={{
      width: "375px",
      height: "760px",
      borderRadius: "44px",
      backgroundColor: "#f7f7f8",
      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 10px #ffffff, 0 0 0 12px #d1d1d6",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {/* Top Camera Punch Hole */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "70px",
        height: "18px",
        backgroundColor: "#000000",
        borderRadius: "14px",
        zIndex: 9999
      }} />

      <div style={{ flex: 1, marginTop: "14px", display: "flex", flexDirection: "column" }}>
        <App />
      </div>
    </div>
  </div>
);
