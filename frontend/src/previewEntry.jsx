import React from "react";
import ReactDOM from "react-dom/client";
import Lenis from "lenis";
import App from "./App";

function PreviewRoot() {
  React.useEffect(() => {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.1
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      const rafId = requestAnimationFrame(raf);
      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    } catch (e) {
      console.warn("Lenis init skipped:", e);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0d1117",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "20px 10px 40px",
      boxSizing: "border-box",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      {/* Top Banner */}
      <div style={{
        marginBottom: "16px",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#161b22",
          border: "1px solid #30363d",
          color: "#ffffff",
          padding: "5px 14px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.5px",
          marginBottom: "8px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#238636", display: "inline-block" }}></span>
          <span>GROQ 1.4s AI • ON-DEVICE STORAGE • LENIS SMOOTH</span>
        </div>
        <h1 style={{ color: "#ffffff", margin: "0 0 4px 0", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.4px" }}>
          Android Call CRM Intelligence
        </h1>
        <p style={{ color: "#8b949e", margin: 0, fontSize: "12px" }}>
          Connected Mobile App • Company Login • 100% On-Device Private
        </p>
      </div>

      {/* Standalone Interactive Phone Frame */}
      <div style={{
        width: "375px",
        height: "760px",
        borderRadius: "44px",
        backgroundColor: "#ffffff",
        boxShadow: "0 25px 70px -15px rgba(0, 0, 0, 0.9), 0 0 0 10px #21262d, 0 0 0 12px #30363d",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}>
        {/* Top Punch Hole Camera */}
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

        {/* App Container */}
        <div style={{ flex: 1, marginTop: "14px", display: "flex", flexDirection: "column", height: "calc(100% - 14px)" }}>
          <App />
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<PreviewRoot />);
