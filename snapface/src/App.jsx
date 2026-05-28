import React, { useState, useEffect, useRef } from "react";

export default function Snapverse() {
  const [screen, setScreen] = useState("auth");
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [stories, setStories] = useState([]);
  const [storyView, setStoryView] = useState(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const [switcher, setSwitcher] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");
  const [photo, setPhoto] = useState("");
  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [snapFilter, setSnapFilter] = useState("none");
  const [captured, setCaptured] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("sf_users") || "[]");
    const s = JSON.parse(localStorage.getItem("sf_session"));
    const p = JSON.parse(localStorage.getItem("sf_posts") || "[]");
    const st = JSON.parse(localStorage.getItem("sf_stories") || "[]");
    const r = JSON.parse(localStorage.getItem("sf_reactions") || "{}");
    const c = JSON.parse(localStorage.getItem("sf_comments") || "{}");

    setUsers(u);
    setSession(s);
    setPosts(p);
    setStories(st);
    setReactions(r);
    setComments(c);

    if (s) setScreen("home");
  }, []);

  useEffect(() => {
    if (screen === "snap") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [screen]);

  useEffect(() => {
    if (storyView === null || !stories[storyView]) return;
    const duration = 5000;
    let start = Date.now();
    progressRef.current = setInterval(() => {
      if (Date.now() - start >= duration) {
        nextStory();
      }
    }, 100);
    return () => clearInterval(progressRef.current);
  }, [storyView, storyIdx]);

  const strengthCheck = (p) => {
    let s = 0;
    if (p.length > 5) s++;
    if (p.length > 9) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const labels = ["", "weak", "fair", "good", "strong", "very-strong"];
    return labels[Math.min(s, 5)];
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {}
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
    canvas.width = 480;
    canvas.height = 640;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg"));
    stopCamera();
  };

  const filters = ["none", "grayscale", "sepia", "hue-rotate", "invert", "saturate"];

  const signup = () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields required"); return;
    }
    if (users.find((u) => u.email === form.email)) {
      setError("Account exists"); return;
    }
    const newUser = { ...form, id: Date.now(), photo };
    const updated = [...users, newUser];
    persist("sf_users", updated);
    setUsers(updated);
    loginUser(newUser);
  };

  const login = () => {
    setError("");
    const user = users.find((u) => u.email === form.email && u.password === form.password);
    if (!user) { setError("Wrong credentials"); return; }
    loginUser(user);
  };

  const loginUser = (user) => {
    setSession(user);
    persist("sf_session", user);
    setScreen("home");
  };

  const logout = () => {
    localStorage.removeItem("sf_session");
    setSession(null);
    setScreen("auth");
    setForm({ name: "", email: "", password: "" });
  };

  const switchAccount = (user) => {
    loginUser(user);
    setSwitcher(false);
  };

  const persist = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createPost = () => {
    if (!text) return;
    const post = { id: Date.now(), user: session, text, likes: 0, image: "" };
    const updated = [post, ...posts];
    setPosts(updated);
    persist("sf_posts", updated);
    setText("");
  };

  const likePost = (id) => {
    const key = `like_${id}`;
    const myReactions = { ...reactions };
    if (myReactions[key] === session.id) {
      delete myReactions[key];
    } else {
      myReactions[key] = session.id;
    }
    setReactions(myReactions);
    persist("sf_reactions", myReactions);

    const updated = posts.map((p) =>
      p.id === id ? { ...p, likes: Object.values(myReactions).filter((v) => v === p.user?.id || v).length } : p
    );
    setPosts(updated);
    persist("sf_posts", updated);
  };

  const addComment = (postId) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;
    const key = `comments_${postId}`;
    const allComments = { ...comments };
    if (!allComments[postId]) allComments[postId] = [];
    allComments[postId].push({ user: session.name, text, id: Date.now() });
    setComments(allComments);
    persist("sf_comments", allComments);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const addStory = () => {
    const media = captured || "https://picsum.photos/300/500";
    const story = { id: Date.now(), user: session, media, viewers: [] };
    const updated = [...stories, story];
    setStories(updated);
    persist("sf_stories", updated);
    setCaptured(null);
    setScreen("home");
  };

  const nextStory = () => {
    if (!stories[storyView]) return;
    const group = stories.filter((s) => s.user.id === stories[storyView].user.id);
    if (storyIdx < group.length - 1) {
      setStoryIdx((i) => i + 1);
    } else {
      setStoryView(null);
      setStoryIdx(0);
    }
  };

  const savedUsers = JSON.parse(localStorage.getItem("sf_users") || "[]");

  return (
    <div className="app">
      {/* ===== AUTH ===== */}
      {screen === "auth" && (
        <div className="auth">
          <div className="card pop">
            <h1 className="logo">Snapface</h1>
            <p className="sub">Facebook + Snapchat Hybrid</p>

            <div className="auth-tabs">
              <span className={authMode === "signup" ? "active" : ""} onClick={() => { setAuthMode("signup"); setError(""); }}>Sign Up</span>
              <span className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setError(""); }}>Log In</span>
            </div>

            {authMode === "signup" && (
              <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            )}

            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <input type="password" placeholder="Password" value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setStrength(strengthCheck(e.target.value)); }}
            />

            {form.password && strength && (
              <div className="strength-row">
                <div className={`strength-bar ${strength}`} style={{ width: `${Math.min(form.password.length * 10, 100)}%` }}></div>
                <span className={`strength-label ${strength}`}>{strength}</span>
              </div>
            )}

            {authMode === "signup" && (
              <div className="photo-upload">
                {photo ? <img src={photo} /> : <div className="photo-placeholder">+</div>}
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setPhoto(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            )}

            {error && <p className="error shake">{error}</p>}

            <button className="btn blue" onClick={authMode === "signup" ? signup : login}>
              {authMode === "signup" ? "Create Account" : "Log In"}
            </button>

            {/* Saved accounts */}
            {savedUsers.length > 0 && (
              <div className="saved-section">
                <p className="saved-label">Saved accounts</p>
                {savedUsers.map((u) => (
                  <div key={u.id} className="saved-user" onClick={() => switchAccount(u)}>
                    <div className="saved-avatar">{u.name?.charAt(0)}</div>
                    <span>{u.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== HOME ===== */}
      {screen === "home" && (
        <div className="home fade">
          <div className="topbar">
            <h2 className="logo">Snapface</h2>
            <div className="topbar-actions">
              <button className="btn small ghost" onClick={() => setSwitcher(true)}>🔄</button>
              <button className="btn small ghost" onClick={() => setScreen("snap")}>👻</button>
              <button className="btn small ghost" onClick={logout}>✕</button>
            </div>
          </div>

          {/* Stories */}
          <div className="stories-row">
            {stories.filter((s, i, a) => a.findIndex((x) => x.user.id === s.user.id) === i).map((group) => (
              <div key={group.id} className="story-ring" onClick={() => { setStoryView(stories.findIndex((s) => s.user.id === group.user.id)); setStoryIdx(0); }}>
                <div className="ring">
                  <img src={group.user.photo || `https://ui-avatars.com/api/?name=${group.user.name}&background=ffd84d`} />
                </div>
                <span>{group.user.name?.split(" ")[0]}</span>
              </div>
            ))}
            {stories.length === 0 && (
              <div className="story-ring" onClick={() => setScreen("snap")}>
                <div className="ring add">+</div>
                <span>Add Story</span>
              </div>
            )}
          </div>

          {/* Create Post */}
          <div className="create-box">
            <div className="avatar-sm">{session?.name?.charAt(0)}</div>
            <input placeholder={`What's on your mind, ${session?.name?.split(" ")[0]}?`} value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn green" onClick={createPost}>Post</button>
          </div>

          {/* Feed */}
          <div className="feed">
            {posts.length === 0 && <p className="empty">No posts yet. Be the first!</p>}
            {posts.map((p) => (
              <div className="post pop" key={p.id}>
                <div className="post-user">
                  <div className="avatar-sm">{p.user?.name?.charAt(0)}</div>
                  <div>
                    <b>{p.user?.name}</b>
                    <span className="time">Just now</span>
                  </div>
                </div>
                <p className="post-text">{p.text}</p>
                <div className="post-actions">
                  <span className={`action ${reactions[`like_${p.id}`] === session?.id ? "liked" : ""}`} onClick={() => likePost(p.id)}>
                    {reactions[`like_${p.id}`] === session?.id ? "❤️" : "🤍"} {Object.values(reactions).filter((v) => v).length}
                  </span>
                  <span className="action" onClick={() => setCommentInputs({ ...commentInputs, [p.id]: "" })}>
                    💬 {comments[p.id]?.length || 0}
                  </span>
                </div>
                {commentInputs[p.id] !== undefined && (
                  <div className="comment-box">
                    <input placeholder="Write a comment..." value={commentInputs[p.id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [p.id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addComment(p.id)}
                    />
                  </div>
                )}
                {comments[p.id]?.map((c) => (
                  <div key={c.id} className="comment"><b>{c.user}</b> {c.text}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== SNAP MODE ===== */}
      {screen === "snap" && (
        <div className="snap fade">
          <div className="snap-top">
            <button className="btn small ghost" onClick={() => { stopCamera(); setScreen("home"); }}>←</button>
            <h3 className="logo">Snapface</h3>
            <button className="btn small ghost">💬</button>
          </div>

          <div className="snap-body">
            {captured ? (
              <img src={captured} className={`snap-preview filter-${snapFilter}`} />
            ) : (
              <video ref={videoRef} autoPlay playsInline className="snap-video" />
            )}

            <div className="filter-bar">
              {filters.map((f) => (
                <span key={f} className={`filter-dot ${snapFilter === f ? "active" : ""}`}
                  style={{ filter: f === "none" ? "none" : `${f}(1)` }}
                  onClick={() => setSnapFilter(f)}
                ></span>
              ))}
            </div>
          </div>

          <div className="snap-footer">
            {captured ? (
              <div className="snap-actions">
                <button className="btn small ghost" onClick={() => { setCaptured(null); startCamera(); }}>Retake</button>
                <button className="btn blue" onClick={addStory}>Post Story</button>
              </div>
            ) : (
              <button className="capture-btn" onClick={capturePhoto}></button>
            )}
          </div>
        </div>
      )}

      {/* ===== SWITCHER MODAL ===== */}
      {switcher && (
        <div className="overlay fade" onClick={() => setSwitcher(false)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()}>
            <h3>Switch Account</h3>
            {savedUsers.map((u) => (
              <div key={u.id} className="switch-user" onClick={() => switchAccount(u)}>
                <div className="switch-avatar">{u.name?.charAt(0)}</div>
                <div>
                  <b>{u.name}</b>
                  <p>{u.email}</p>
                </div>
                {u.id === session?.id && <span className="active-badge">Active</span>}
              </div>
            ))}
            <button className="btn blue" onClick={() => { setSwitcher(false); logout(); }}>Log Out</button>
          </div>
        </div>
      )}

      {/* ===== STORY VIEWER MODAL ===== */}
      {storyView !== null && stories[storyView] && (
        <div className="story-viewer fade" onClick={nextStory}>
          <div className="story-header">
            <div className="story-progress">
              {stories.filter((s) => s.user.id === stories[storyView].user.id).map((_, i) => (
                <div key={i} className={`seg ${i < storyIdx ? "done" : ""} ${i === storyIdx ? "active" : ""}`}>
                  <div className="seg-fill" style={i < storyIdx ? { width: "100%" } : {}}></div>
                </div>
              ))}
            </div>
            <div className="story-user">
              <div className="avatar-sm">{stories[storyView].user.name?.charAt(0)}</div>
              <span>{stories[storyView].user.name}</span>
            </div>
            <button className="story-close" onClick={(e) => { e.stopPropagation(); setStoryView(null); setStoryIdx(0); }}>✕</button>
          </div>
          <img src={stories[storyView].media} className="story-media" />
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f1115; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        .app { min-height: 100vh; }

        /* Animations */
        .fade { animation: fadeIn 0.3s ease; }
        .pop { animation: popIn 0.25s ease; }
        .shake { animation: shake 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        .logo {
          background: linear-gradient(135deg, #1877f2 60%, #ffd84d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn {
          width: 100%; padding: 12px; border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: transform 0.15s, opacity 0.2s;
        }
        .btn:active { transform: scale(0.97); }
        .btn.small { width: auto; padding: 8px 14px; font-size: 13px; }
        .blue { background: #1877f2; color: #fff; }
        .blue:hover { background: #166fe5; }
        .green { background: #42b72a; color: #fff; }
        .green:hover { background: #36a420; }
        .ghost { background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .ghost:hover { background: rgba(255,255,255,0.1); }

        /* ===== AUTH ===== */
        .auth { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .card { background: #171a21; padding: 28px 24px; border-radius: 16px; width: 100%; max-width: 360px; }
        .card h1 { font-size: 32px; text-align: center; }
        .card .sub { text-align: center; color: #9aa3b2; font-size: 13px; margin-bottom: 20px; }

        .auth-tabs { display: flex; gap: 0; margin-bottom: 16px; background: #0f1115; border-radius: 10px; overflow: hidden; }
        .auth-tabs span { flex: 1; padding: 10px; text-align: center; cursor: pointer; font-size: 13px; font-weight: 600; color: #9aa3b2; }
        .auth-tabs span.active { background: #1877f2; color: #fff; }

        input { width: 100%; padding: 12px 14px; margin-bottom: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: #0f1115; color: #fff; font-size: 14px; outline: none; }
        input:focus { border-color: #1877f2; }
        input::placeholder { color: #555; }

        .strength-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .strength-bar { height: 4px; border-radius: 4px; transition: all 0.3s; }
        .strength-bar.weak { background: #e41e3f; }
        .strength-bar.fair { background: #f7931e; }
        .strength-bar.good { background: #1877f2; }
        .strength-bar.strong { background: #2ecc71; }
        .strength-bar.very-strong { background: #ffd84d; }
        .strength-label { font-size: 11px; text-transform: uppercase; }
        .strength-label.weak { color: #e41e3f; }
        .strength-label.fair { color: #f7931e; }
        .strength-label.good { color: #1877f2; }
        .strength-label.strong { color: #2ecc71; }
        .strength-label.very-strong { color: #ffd84d; }

        .photo-upload { position: relative; width: 64px; height: 64px; margin: 0 auto 12px; cursor: pointer; }
        .photo-upload img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .photo-placeholder { width: 100%; height: 100%; border-radius: 50%; background: #222; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #666; border: 2px dashed #444; }
        .photo-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .error { color: #e41e3f; font-size: 13px; text-align: center; margin-bottom: 8px; }

        .saved-section { margin-top: 16px; }
        .saved-label { font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .saved-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-bottom: 4px; }
        .saved-user:hover { background: rgba(255,255,255,0.05); }
        .saved-avatar { width: 32px; height: 32px; border-radius: 50%; background: #1877f2; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }

        /* ===== HOME ===== */
        .topbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #171a21; position: sticky; top: 0; z-index: 50; }
        .topbar h2 { font-size: 20px; }
        .topbar-actions { display: flex; gap: 6px; }

        .stories-row { display: flex; gap: 10px; padding: 12px 16px; overflow-x: auto; scrollbar-width: none; }
        .stories-row::-webkit-scrollbar { display: none; }
        .story-ring { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; flex-shrink: 0; }
        .ring { width: 56px; height: 56px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #ffd84d, #1877f2); }
        .ring img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid #171a21; }
        .ring.add { display: flex; align-items: center; justify-content: center; font-size: 28px; color: #fff; background: #222; border: 2px dashed #444; padding: 0; }
        .story-ring span { font-size: 10px; color: #888; }

        .create-box { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #171a21; margin: 0 12px; border-radius: 12px; }
        .avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: #1877f2; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .create-box input { flex: 1; margin-bottom: 0; background: #0f1115; }
        .create-box .btn { width: auto; padding: 10px 18px; }

        .feed { padding: 12px; }
        .empty { text-align: center; color: #555; padding: 40px 0; }

        .post { background: #171a21; padding: 16px; border-radius: 14px; margin-bottom: 10px; animation: slideUp 0.3s ease; }
        .post-user { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .post-user .time { font-size: 11px; color: #555; display: block; }
        .post-text { margin-bottom: 12px; line-height: 1.5; }

        .post-actions { display: flex; gap: 20px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; }
        .action { display: flex; align-items: center; gap: 4px; cursor: pointer; color: #9aa3b2; font-size: 13px; transition: color 0.2s; }
        .action:hover { color: #fff; }
        .action.liked { color: #e41e3f; }

        .comment-box { margin-top: 8px; }
        .comment-box input { margin-bottom: 0; padding: 8px 12px; font-size: 13px; }

        .comment { font-size: 13px; margin-top: 6px; color: #ccc; }
        .comment b { color: #fff; margin-right: 4px; }

        /* ===== SNAP ===== */
        .snap { height: 100vh; background: #000; display: flex; flex-direction: column; }
        .snap-top { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
        .snap-top h3 { font-size: 18px; }

        .snap-body { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .snap-video { width: 100%; height: 100%; object-fit: cover; }
        .snap-preview { max-width: 100%; max-height: 100%; object-fit: contain; }

        .filter-bar { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 24px; backdrop-filter: blur(10px); }
        .filter-dot { width: 24px; height: 24px; border-radius: 50%; background: #fff; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
        .filter-dot.active { border-color: #ffd84d; }

        .snap-footer { display: flex; justify-content: center; padding: 30px; }
        .capture-btn { width: 68px; height: 68px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.8); background: transparent; cursor: pointer; transition: transform 0.15s; }
        .capture-btn:active { transform: scale(0.92); }

        .snap-actions { display: flex; gap: 16px; align-items: center; }
        .filter-grayscale { filter: grayscale(100%); }
        .filter-sepia { filter: sepia(100%); }
        .filter-hue-rotate { filter: hue-rotate(180deg); }
        .filter-invert { filter: invert(100%); }
        .filter-saturate { filter: saturate(200%); }

        /* ===== OVERLAY / MODAL ===== */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #171a21; border-radius: 16px; padding: 24px; width: 90%; max-width: 380px; }
        .modal h3 { margin-bottom: 16px; }

        .switch-user { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-bottom: 4px; }
        .switch-user:hover { background: rgba(255,255,255,0.05); }
        .switch-avatar { width: 40px; height: 40px; border-radius: 50%; background: #1877f2; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .switch-user p { font-size: 12px; color: #666; }
        .active-badge { margin-left: auto; font-size: 11px; background: rgba(24,119,242,0.2); color: #1877f2; padding: 2px 8px; border-radius: 8px; }

        /* ===== STORY VIEWER ===== */
        .story-viewer { position: fixed; inset: 0; background: #000; z-index: 200; display: flex; flex-direction: column; cursor: pointer; }
        .story-header { padding: 16px; position: relative; }
        .story-progress { display: flex; gap: 4px; margin-bottom: 12px; }
        .seg { flex: 1; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden; }
        .seg-fill { height: 100%; background: #fff; width: 0; animation: pulse 1s infinite; }
        .seg.done .seg-fill { width: 100%; animation: none; }
        .seg.active .seg-fill { width: 100%; transition: width 5s linear; animation: none; }
        .story-user { display: flex; align-items: center; gap: 8px; }
        .story-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; }
        .story-media { flex: 1; object-fit: contain; width: 100%; padding: 16px; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 480px) {
          .card { padding: 20px 16px; }
          .topbar { padding: 8px 12px; }
          .stories-row { padding: 8px 12px; }
          .create-box { margin: 0 8px; padding: 10px 12px; }
          .feed { padding: 8px; }
          .post { padding: 12px; }
          .modal { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
