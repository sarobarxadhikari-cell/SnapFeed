import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Snap from "./pages/Snap";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/feed" element={
          <ProtectedRoute><Feed /></ProtectedRoute>
        } />
        <Route path="/snap" element={
          <ProtectedRoute><Snap /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute><Chat /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute><Map /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}
