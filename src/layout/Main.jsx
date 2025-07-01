import "../css/Main.css";
import Player from "./Player";
import { useVideo } from "../context/VideoContext";

export default function Main({ children }) {
  // const { selectedVideo } = useVideo();
  return (
    <div className="Main">
     {children}
      {/* {selectedVideo && (
        <Player
          videoId={selectedVideo.videoId}
          artist={selectedVideo.artist}
          title={selectedVideo.title}
          videoPic={`https://img.youtube.com/vi/${selectedVideo.videoId}/mqdefault.jpg`}
        />
      )} */}
    </div>
  );
}
