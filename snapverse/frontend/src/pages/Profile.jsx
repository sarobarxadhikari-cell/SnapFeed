import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthAPI, FeedAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { userId } = useParams();
  const { user: me, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const isOwn = !userId || userId === me?._id;
  const targetId = isOwn ? me?._id : userId;

  useEffect(() => {
    if (isOwn) {
      setProfile(me);
      setBio(me?.bio || "");
      setPhoto(me?.photo || "");
    }
    loadPosts();
  }, [userId, me]);

  const loadPosts = async () => {
    try {
      const res = await FeedAPI.getFeed();
      setPosts((res.data.posts || []).filter(p => p.user?._id === targetId));
    } catch { }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      const res = await AuthAPI.updateProfile({ bio, photo });
      updateUser(res.data.user);
      setEditing(false);
      setPreview("");
    } catch (err) {
      console.error("Profile update error", err);
    }
  };

  if (!profile) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button className="profile-back" onClick={() => navigate("/feed")}>← Feed</button>
        <h2>{isOwn ? "Your Profile" : profile?.name}</h2>
        <div></div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-section">
          <div
            className="profile-avatar"
            onClick={() => isOwn && fileRef.current?.click()}
            style={{ cursor: isOwn ? "pointer" : "default" }}
          >
            {preview ? (
              <img src={preview} />
            ) : profile?.photo ? (
              <img src={profile.photo} />
            ) : (
              <span className="avatar-letter">{profile?.name?.charAt(0)}</span>
            )}
            {isOwn && <div className="avatar-overlay">📷</div>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoUpload}
          />
        </div>

        <h1 className="profile-name">{profile?.name}</h1>

        {isOwn && editing ? (
          <div className="profile-edit-form">
            <textarea
              placeholder="Write a bio..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="profile-bio-input"
            />
            <div className="profile-edit-actions">
              <button className="btn-sm btn-primary" onClick={saveProfile}>Save</button>
              <button className="btn-sm btn-secondary" onClick={() => { setEditing(false); setBio(me?.bio || ""); setPreview(""); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="profile-bio">{profile?.bio || "No bio yet"}</p>
        )}

        {isOwn && !editing && (
          <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
        )}

        <div className="profile-stats">
          <div className="stat-item">
            <b>{profile?.friends?.length || 0}</b>
            <span>Friends</span>
          </div>
          <div className="stat-item">
            <b>{posts.length}</b>
            <span>Posts</span>
          </div>
        </div>
      </div>

      <div className="profile-posts">
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="profile-post-card">
              <p>{post.text}</p>
              {post.image && <img src={post.image} />}
              <div className="profile-post-stats">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
