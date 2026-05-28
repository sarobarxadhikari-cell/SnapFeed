import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Map() {
  const [locations, setLocations] = useState([]);
  const [myLocation, setMyLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        try {
          await MapAPI.updateMyLocation(latitude, longitude);
          const res = await MapAPI.getFriendLocations();
          setLocations(res.data.locations || []);
        } catch { }
        setLoading(false);
      },
      () => {
        loadWithoutLocation();
      }
    );
  }, []);

  const loadWithoutLocation = async () => {
    try {
      const res = await MapAPI.getFriendLocations();
      setLocations(res.data.locations || []);
    } catch { }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-topbar">
        <button className="map-back" onClick={() => navigate("/feed")}>← Feed</button>
        <h2>Snap Map</h2>
        <div></div>
      </div>

      {/* Map Visualization */}
      <div className="map-container">
        <div className="map-visual">
          <div className="map-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="map-cell" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="map-cell-inner"></div>
              </div>
            ))}
          </div>

          {/* My location */}
          {myLocation && (
            <div className="map-marker my-location" title="You are here">
              <div className="marker-pulse"></div>
              <div className="marker-dot"></div>
              <span className="marker-label">You</span>
            </div>
          )}

          {/* Friend locations */}
          {locations.map((loc, i) => (
            <div
              key={loc.id}
              className="map-marker friend-location"
              style={{
                top: `${20 + (i * 15) % 60}%`,
                left: `${15 + (i * 20) % 70}%`
              }}
              title={loc.name}
            >
              <img
                src={loc.photo || `https://ui-avatars.com/api/?name=${loc.name}&background=ffd84d`}
                className="marker-avatar"
              />
              <span className="marker-label">{loc.name?.split(" ")[0]}</span>
            </div>
          ))}

          {!myLocation && locations.length === 0 && (
            <div className="map-empty">
              <p>📍 No locations to show</p>
              <p className="map-empty-sub">Share your location to see friends on the map</p>
            </div>
          )}
        </div>
      </div>

      {/* Friends List */}
      <div className="map-friends-list">
        <h3>Friends on Map</h3>
        {locations.map((loc) => (
          <div key={loc.id} className="map-friend-item">
            <img src={loc.photo || `https://ui-avatars.com/api/?name=${loc.name}`} />
            <div>
              <b>{loc.name}</b>
              <p>📍 {loc.lat?.toFixed(4)}, {loc.lng?.toFixed(4)}</p>
            </div>
          </div>
        ))}
        {locations.length === 0 && <p className="no-locations">No friends sharing location</p>}
      </div>
    </div>
  );
}
