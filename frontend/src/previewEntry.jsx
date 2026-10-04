import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <div style={{
    minHeight: "100vh",
    backgroundColor: "#030712",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 10px",
    fontFamily: "system-ui, sans-serif"
  }}>
    <div style={{
      marginBottom: "14px",
      textAlign: "center"
    }}>
      <div style={{
        display: "inline-block",
        background: "rgba(16, 185, 129, 0.15)",
        border: "1px solid #10b981",
        color: "#10b981",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "700",
        marginBottom: "6px"
      }}>
        GROQ AI ENGINE ONLINE (1.4s)
      </div>
      <h2 style={{ color: "#ffffff", margin: "0 0 4px 0", fontSize: "17px", fontWeight: "800" }}>
        📱 Android Native App Preview
      </h2>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: "12px" }}>
        Testing React Native UI &amp; On-Device Storage • Backend Port: 4000
      </p>
    </div>

    {/* Phone Mockup Frame */}
    <div style={{
      width: "375px",
      height: "760px",
      borderRadius: "36px",
      backgroundColor: "#090d16",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 8px #1e293b, 0 0 0 10px #334155",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {/* Top Camera Punch Hole */}
      <div style={{
        position: "absolute",
        top: "8px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "16px",
        backgroundColor: "#000000",
        borderRadius: "12px",
        zIndex: 9999
      }} />

      <div style={{ flex: 1, marginTop: "12px", display: "flex", flexDirection: "column" }}>
        <App />
      </div>
    </div>
  </div>
);
