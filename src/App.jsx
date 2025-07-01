import { Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <VideoProvider>
      <div className="App">
        <div className="left-column">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Home />} />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/favs" element={<Favorites />} />
          </Routes>
          <VideoPlayerWrapper />
        </div>
      </div>
    </VideoProvider>
  );
}

function VideoPlayerWrapper() {
  const { selectedVideo, videosList } = useVideo();

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
