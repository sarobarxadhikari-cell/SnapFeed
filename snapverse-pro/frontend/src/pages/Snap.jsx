import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Snap({ user }) {
  const [view, setView] = useState("camera");
  const [captured, setCaptured] = useState(null);
  const [filter, setFilter] = useState("none");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      console.warn("Camera not available");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 640;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg"));
    stopCamera();
    setView("preview");
  };

  const filters = ["none", "grayscale", "sepia", "hue-rotate", "invert", "saturate"];

  return (
    <div className={`snap-page ${filter !== "none" ? `filter-${filter}` : ""}`}>
      <div className="snap-topbar">
        <button className="snap-back" onClick={() => navigate("/")}>← Home</button>
        <h3 className="logo">Snapverse</h3>
        <div></div>
      </div>

      <div className="snap-body">
        {view === "camera" ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="snap-video" />
            <div className="filter-bar">
              {filters.map(f => (
                <span key={f}
                  className={`filter-dot ${filter === f ? "active" : ""}`}
                  style={{ filter: f === "none" ? "none" : `${f}(1)` }}
                  onClick={() => setFilter(f)}
                ></span>
              ))}
            </div>
            <div className="snap-capture-area">
              <button className="capture-btn" onClick={capture}></button>
            </div>
          </>
        ) : (
          <div className="snap-preview-area">
            <img src={captured} className="snap-preview" />
            <div className="snap-preview-actions">
              <button className="btn ghost" onClick={() => { setView("camera"); setCaptured(null); startCamera(); }}>Retake</button>
              <button className="btn blue" onClick={() => { setView("camera"); setCaptured(null); startCamera(); }}>Send Snap</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
