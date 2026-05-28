import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sv_token");
      localStorage.removeItem("sv_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;

export const AuthAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  searchUsers: (q) => api.get(`/auth/search?q=${q}`),
  sendFriendRequest: (userId) => api.post(`/auth/friend-request/${userId}`),
  acceptFriendRequest: (userId) => api.post(`/auth/accept-request/${userId}`),
  updateLocation: (lat, lng) => api.put("/auth/location", { lat, lng })
};

export const FeedAPI = {
  getFeed: () => api.get("/feed"),
  getExplore: () => api.get("/feed/explore"),
  createPost: (data) => api.post("/feed", data),
  likePost: (id, type) => api.post(`/feed/${id}/like`, { type }),
  commentPost: (id, text) => api.post(`/feed/${id}/comment`, { text }),
  deletePost: (id) => api.delete(`/feed/${id}`)
};

export const SnapAPI = {
  getStories: () => api.get("/snap/stories"),
  createStory: (data) => api.post("/snap/story", data),
  viewStory: (id) => api.post(`/snap/story/${id}/view`),
  deleteStory: (id) => api.delete(`/snap/story/${id}`),
  getFriendsLocation: () => api.get("/snap/friends-location")
};

export const ChatAPI = {
  getConversations: () => api.get("/chat/conversations"),
  getMessages: (userId) => api.get(`/chat/${userId}`),
  sendMessage: (data) => api.post("/chat", data),
  markRead: (id) => api.post(`/chat/${id}/read`),
  getUnopenedSnaps: () => api.get("/chat/snap/unopened"),
  openSnap: (id) => api.post(`/chat/snap/${id}/open`)
};

export const MapAPI = {
  getFriendLocations: () => api.get("/map/friends"),
  updateMyLocation: (lat, lng) => api.put("/map/me", { lat, lng })
};
