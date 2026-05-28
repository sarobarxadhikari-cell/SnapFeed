import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/ui/LoadingScreen';
import NotificationStack from './components/ui/NotificationStack';
import AppLayout from './components/layout/AppLayout';
import useUIStore from './store/uiStore';

// Auth pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// Main Snapfeed pages
const FeedPage = lazy(() => import('./pages/FeedPage'));
const MessengerPage = lazy(() => import('./pages/MessengerPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

// Video call (full-screen)
const VideoCallPage = lazy(() => import('./pages/VideoCallPage'));

// Ultra section pages
const UltraHome = lazy(() => import('./pages/Ultra/UltraHome'));
const UltraCamera = lazy(() => import('./pages/Ultra/UltraCamera'));
const UltraChat = lazy(() => import('./pages/Ultra/UltraChat'));
const UltraMaps = lazy(() => import('./pages/Ultra/UltraMaps'));
const UltraStories = lazy(() => import('./pages/Ultra/UltraStories'));
const UltraCalls = lazy(() => import('./pages/Ultra/UltraCalls'));
const UltraDiscover = lazy(() => import('./pages/Ultra/UltraDiscover'));

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return children;
}

function AppContent() {
  const theme = useUIStore((s) => s.theme);

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#0b0f17] text-white">
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public auth routes */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

              {/* Main Snapfeed (Facebook-style, inside AppLayout) */}
              <Route path="/feed" element={<ProtectedRoute><AppLayout><FeedPage /></AppLayout></ProtectedRoute>} />
              <Route path="/messenger" element={<ProtectedRoute><AppLayout><MessengerPage /></AppLayout></ProtectedRoute>} />
              <Route path="/messenger/:conversationId" element={<ProtectedRoute><AppLayout><MessengerPage /></AppLayout></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><AppLayout><PlaceholderPage title="Friends" emoji="👥" /></AppLayout></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><AppLayout><PlaceholderPage title="Marketplace" emoji="🛒" /></AppLayout></ProtectedRoute>} />
              <Route path="/groups" element={<ProtectedRoute><AppLayout><PlaceholderPage title="Groups" emoji="🌍" /></AppLayout></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><AppLayout><PlaceholderPage title="Saved" emoji="🔖" /></AppLayout></ProtectedRoute>} />

              {/* Video call (full-screen, no AppLayout) */}
              <Route path="/call" element={<ProtectedRoute><VideoCallPage /></ProtectedRoute>} />

              {/* Snapfeed Ultra section (full-screen, no AppLayout) */}
              <Route path="/ultra" element={<ProtectedRoute><UltraHome /></ProtectedRoute>} />
              <Route path="/ultra/camera" element={<ProtectedRoute><UltraCamera /></ProtectedRoute>} />
              <Route path="/ultra/chat" element={<ProtectedRoute><UltraChat /></ProtectedRoute>} />
              <Route path="/ultra/maps" element={<ProtectedRoute><UltraMaps /></ProtectedRoute>} />
              <Route path="/ultra/stories" element={<ProtectedRoute><UltraStories /></ProtectedRoute>} />
              <Route path="/ultra/calls" element={<ProtectedRoute><UltraCalls /></ProtectedRoute>} />
              <Route path="/ultra/discover" element={<ProtectedRoute><UltraDiscover /></ProtectedRoute>} />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <NotificationStack />
      </div>
    </div>
  );
}

function PlaceholderPage({ title, emoji }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl">{emoji}</span>
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
        <p className="text-gray-500 mt-2">Coming soon...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
