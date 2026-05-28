import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SnapAPI, MapAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Snap() {
  const [view, setView] = useState("camera");
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [filter, setFilter] = useState("");
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const { user } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const progressRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (view === "camera") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [view]);

  useEffect(() => {
    SnapAPI.getStories().then((res) => setStories(res.data.groups || [])).catch(() => {});
    MapAPI.getFriendLocations().then((res) => setFriends(res.data.locations || [])).catch(() => {});
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
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setMedia(dataUrl);
    setPreview(dataUrl);
    setView("preview");
    stopCamera();
  };

  const filters = ["none", "grayscale", "sepia", "hue-rotate", "invert", "saturate"];

  const applyFilter = (f) => {
    setFilter(f);
  };

  const postStory = async () => {
    if (!media) return;
    try {
      await SnapAPI.createStory({ media, caption });
      setMedia(null);
      setCaption("");
      setPreview(null);
      setView("stories");
    } catch (err) {
      console.error("Story post error", err);
    }
  };

  const openStoryViewer = (group) => {
    setActiveStory(group);
    setStoryIndex(0);
    setView("story-viewer");

    if (progressRef.current) clearInterval(progressRef.current);
  };

  useEffect(() => {
    if (view !== "story-viewer" || !activeStory) return;

    const duration = 5000;
    let start = Date.now();
    const bar = document.getElementById("story-progress");

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      if (bar) bar.style.width = `${pct}%`;
      if (pct >= 100) {
        nextStory();
      }
    }, 100);

    return () => clearInterval(progressRef.current);
  }, [view, activeStory, storyIndex]);

  const nextStory = () => {
    if (!activeStory) return;
    if (storyIndex < activeStory.stories.length - 1) {
      setStoryIndex((i) => i + 1);
    } else {
      setView("camera");
      setActiveStory(null);
    }
  };

  const prevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
    }
  };

  return (
    <div className={`snap-page ${filter !== "none" && filter ? `filter-${filter}` : ""}`}>
      {/* Snap Topbar */}
      <div className="snap-topbar">
        <button className="snap-back" onClick={() => navigate("/feed")}>✕</button>
        <h2 className="snap-logo">Snapverse</h2>
        <div className="snap-topbar-actions">
          <button onClick={() => { setView("stories"); stopCamera(); }}>📖</button>
          <button onClick={() => setShowFriends(!showFriends)}>👥</button>
        </div>
      </div>

      {/* Camera View */}
      {view === "camera" && (
        <div className="snap-camera-container">
          <video ref={videoRef} autoPlay playsInline className="snap-video" />
          <div className="snap-camera-overlay">
            <div className="snap-filter-bar">
              {filters.map((f) => (
                <span
                  key={f}
                  className={`filter-dot ${filter === f ? "active" : ""}`}
                  onClick={() => applyFilter(f)}
                  style={{
                    filter: f === "none" ? "none" : `${f}(1)`
                  }}
                ></span>
              ))}
            </div>
          </div>
          <div className="snap-capture-area">
            <button className="snap-capture-btn" onClick={capturePhoto}></button>
          </div>
        </div>
      )}

      {/* Preview */}
      {view === "preview" && preview && (
        <div className="snap-preview-container">
          <img
            src={preview}
            className={`snap-preview-img ${filter !== "none" ? `filter-${filter}` : ""}`}
          />
          <div className="snap-preview-actions">
            <button className="snap-btn" onClick={() => { setView("camera"); setMedia(null); setPreview(null); startCamera(); }}>Retake</button>
            <input
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="snap-caption-input"
            />
            <button className="snap-btn primary" onClick={postStory}>Send Snap</button>
          </div>
        </div>
      )}

      {/* Stories View */}
      {view === "stories" && (
        <div className="snap-stories-grid">
          <div className="snap-my-story" onClick={() => setView("camera")}>
            <div className="snap-my-story-icon">+</div>
            <p>My Story</p>
          </div>
          {stories.map((group) => (
            <div key={group.user?._id} className="snap-story-card" onClick={() => openStoryViewer(group)}>
              <div className="snap-story-ring">
                <img
                  src={group.user?.photo || `https://ui-avatars.com/api/?name=${group.user?.name}&background=ffd84d`}
                />
              </div>
              <p>{group.user?.name?.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Story Viewer */}
      {view === "story-viewer" && activeStory && (
        <div className="story-viewer" onClick={nextStory}>
          <div className="story-viewer-header">
            <div className="story-progress-bar">
              {activeStory.stories.map((_, i) => (
                <div key={i} className="story-progress-segment">
                  <div
                    id={i === storyIndex ? "story-progress" : undefined}
                    className={`story-progress-fill ${i < storyIndex ? "completed" : ""} ${i === storyIndex ? "active" : ""}`}
                    style={i < storyIndex ? { width: "100%" } : {}}
                  ></div>
                </div>
              ))}
            </div>
            <div className="story-user-info">
              <img src={activeStory.user?.photo || `https://ui-avatars.com/api/?name=${activeStory.user?.name}`} />
              <span>{activeStory.user?.name}</span>
              <span className="story-time">Just now</span>
            </div>
            <button className="story-close" onClick={(e) => { e.stopPropagation(); setView("camera"); setActiveStory(null); }}>✕</button>
          </div>

          <div className="story-media">
            <img src={activeStory.stories[storyIndex]?.media} />
            {activeStory.stories[storyIndex]?.caption && (
              <p className="story-caption">{activeStory.stories[storyIndex].caption}</p>
            )}
          </div>

          <div className="story-tap-hints">
            <span onClick={(e) => { e.stopPropagation(); prevStory(); }}>◀</span>
            <span onClick={(e) => { e.stopPropagation(); nextStory(); }}>▶</span>
          </div>
        </div>
      )}

      {/* Friends Panel */}
      {showFriends && (
        <div className="snap-friends-panel" onClick={() => setShowFriends(false)}>
          <div className="snap-friends-content" onClick={(e) => e.stopPropagation()}>
            <h3>Snap Map Friends</h3>
            {friends.length === 0 ? (
              <p className="no-friends">No friends sharing location</p>
            ) : (
              friends.map((f) => (
                <div key={f.id} className="friend-location-item">
                  <img src={f.photo || `https://ui-avatars.com/api/?name=${f.name}`} />
                  <div>
                    <b>{f.name}</b>
                    <p>📍 {f.lat?.toFixed(2)}, {f.lng?.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
