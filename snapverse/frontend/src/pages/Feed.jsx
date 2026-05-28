import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FeedAPI, AuthAPI, SnapAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [stories, setStories] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feedRes, storyRes] = await Promise.all([
        FeedAPI.getFeed(),
        SnapAPI.getStories()
      ]);
      setPosts(feedRes.data.posts || []);
      setStories(storyRes.data.groups || []);
      setFriendRequests(user?.friendRequests || []);
    } catch (err) {
      console.error("Feed load error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (q) => {
    setSearchQ(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await AuthAPI.searchUsers(q);
      setSearchResults(res.data.users || []);
    } catch { setSearchResults([]); }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await FeedAPI.createPost({ text: newPost });
      setPosts((prev) => [res.data.post, ...prev]);
      setNewPost("");
      setShowCreate(false);
    } catch (err) {
      console.error("Post error", err);
    }
  };

  const handleLike = async (postId, reactionType) => {
    try {
      const res = await FeedAPI.likePost(postId, reactionType || "like");
      setPosts((prev) => prev.map(p =>
        p._id === postId ? { ...p, reactions: res.data.reactions, likes: res.data.likes } : p
      ));
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const res = await FeedAPI.commentPost(postId, text);
      setPosts((prev) => prev.map(p =>
        p._id === postId ? { ...p, comments: res.data.comments } : p
      ));
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await AuthAPI.sendFriendRequest(userId);
      setSearchResults((prev) => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error("Friend request error", err);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await AuthAPI.acceptFriendRequest(userId);
      setFriendRequests((prev) => prev.filter(id => id !== userId));
    } catch (err) {
      console.error("Accept error", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <Navbar onSearch={handleSearch} searchResults={searchResults} onSendRequest={handleSendRequest} />

      <div className="feed-layout">
        <aside className="feed-sidebar-left">
          <div className="sidebar-card">
            <div className="sidebar-user" onClick={() => navigate("/profile")}>
              <div className="avatar-sm">{user?.name?.charAt(0)}</div>
              <span>{user?.name}</span>
            </div>
            <div className="sidebar-item"><span>👥</span> Friends</div>
            <div className="sidebar-item"><span>📺</span> Videos</div>
            <div className="sidebar-item"><span>📅</span> Events</div>
            <div className="sidebar-item"><span>📌</span> Saved</div>
          </div>

          {friendRequests.length > 0 && (
            <div className="sidebar-card">
              <h4>Friend Requests ({friendRequests.length})</h4>
              {friendRequests.map((reqId) => (
                <div key={reqId} className="request-item">
                  <span>👤 User</span>
                  <button className="btn-sm btn-primary" onClick={() => handleAcceptRequest(reqId)}>Accept</button>
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className="feed-center">
          <StoryBar stories={stories} />

          <div className="create-post-card" onClick={() => setShowCreate(true)}>
            <div className="avatar-sm">{user?.name?.charAt(0)}</div>
            <span className="create-post-placeholder">What's on your mind, {user?.name?.split(" ")[0]}?</span>
          </div>

          {showCreate && (
            <div className="create-post-modal">
              <div className="create-post-modal-content">
                <div className="modal-header">
                  <h3>Create Post</h3>
                  <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
                </div>
                <textarea
                  placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="create-post-textarea"
                  autoFocus
                />
                <button className="auth-btn" onClick={handlePost}>Post</button>
              </div>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="empty-feed">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onLike={(type) => handleLike(post._id, type)}
                onComment={(text) => handleComment(post._id, text)}
              />
            ))
          )}
        </main>

        <aside className="feed-sidebar-right">
          <div className="sidebar-card">
            <h4>Sponsored</h4>
            <div className="sponsored-ad">
              <div className="ad-placeholder">📢</div>
              <p>Premium Ad Space</p>
            </div>
          </div>
          <div className="sidebar-card">
            <h4>Trending</h4>
            <div className="trending-item">#SnapverseLaunch</div>
            <div className="trending-item">#SocialRevolution</div>
            <div className="trending-item">#ConnectAndSnap</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
