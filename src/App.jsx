import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TagPage from "./pages/TagPage";
import Favorites from "./pages/Favorites";
import { VideoProvider } from "./context/VideoContext";
import { useVideo } from "./context/VideoContext";
import Player from "./layout/Player";
import Header from "./layout/Header";
import PrivateRoute from "./routers/PrivateRouter";
import PublicRoute from "./routers/PublicRouter";
import "./App.css"

export default function App() {
  return (
    <VideoProvider>
      <div className="App">
        <div className="left-column">
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  {" "}
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/tag/:tag"
              element={
                <PrivateRoute>
                  {" "}
                  <TagPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/favs"
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              }
            />
          </Routes>
          <VideoPlayerWrapper />
        </div>
      </div>
    </VideoProvider>
  );
}

function VideoPlayerWrapper() {
  const { selectedVideo, videosList } = useVideo();
   const location = useLocation();

  // No mostrar player en login ni registro
  if (location.pathname === "/" || location.pathname === "/register") return null;

  if (!selectedVideo) return null;

  return (
    <Player
      videoId={selectedVideo.videoId}
      artist={selectedVideo.artist}
      title={selectedVideo.title}
      videoPic={`https://img.youtube.com/vi/${selectedVideo.videoId}/mqdefault.jpg`}
      videosListForPlay={videosList}
    />
  );
}
