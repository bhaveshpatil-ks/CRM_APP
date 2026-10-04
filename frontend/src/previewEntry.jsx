import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Lenis from "lenis";
import App from "./App";

function PreviewRoot() {
  useEffect(() => {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
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
      console.warn("Lenis init fallback:", e);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0d14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "30px 10px 40px",
      boxSizing: "border-box",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        marginBottom: "20px",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#161b26",
          border: "1px solid #283042",
          color: "#ffffff",
          padding: "5px 14px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.5px",
          marginBottom: "10px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34c759", display: "inline-block" }}></span>
          <span>ONLINE • GROQ 1.4s AI • LENIS SMOOTH</span>
        </div>
        <h2 style={{ color: "#ffffff", margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.4px" }}>
          Android Call Intelligence App
        </h2>
        <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>
          Connected Mobile App • Company Login • 100% On-Device Private Storage
        </p>
      </div>

      {/* Phone Mockup Frame */}
      <div
        data-lenis-prevent="true"
        style={{
          width: "375px",
          height: "760px",
          maxHeight: "90vh",
          borderRadius: "44px",
          backgroundColor: "#f7f7f8",
          boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 0 10px #1e2638, 0 0 0 12px #2e3b56",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
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

        <div style={{ flex: 1, marginTop: "14px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <App />
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<PreviewRoot />);
