import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import Lenis from "lenis";
import App from "./App";

function PreviewRoot() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll on the viewport
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2
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
  }, []);

  return (
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
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "#000000",
          color: "#ffffff",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.5px",
          marginBottom: "8px"
        }}>
          <span>LENIS SMOOTH SCROLL</span>
          <span>•</span>
          <span>GROQ 1.4s AI</span>
          <span>•</span>
          <span>WEBSITE SYNC</span>
        </div>
        <h2 style={{ color: "#000000", margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", letterSpacing: "-0.4px" }}>
          Android Call Intelligence CRM
        </h2>
        <p style={{ color: "#8e8e93", margin: 0, fontSize: "12px" }}>
          Connected Mobile App • Company ID Login • 100% On-Device Privacy
        </p>
      </div>

      {/* Phone Mockup Frame */}
      <div
        ref={scrollContainerRef}
        data-lenis-prevent
        style={{
          width: "375px",
          height: "760px",
          borderRadius: "44px",
          backgroundColor: "#f7f7f8",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 10px #ffffff, 0 0 0 12px #d1d1d6",
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
