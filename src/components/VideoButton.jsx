import { FaPlayCircle } from "react-icons/fa";
import "../css/VideoButton.css";
import { useVideo } from "../context/VideoContext";

export default function VideoButton({
  videoId,
  title,
  artist,
  onClick,
  selectedVideoId,
}) {

  return (
    <div
      className={selectedVideoId === videoId ? "video playing" : "video"}
      onClick={onClick}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        className="video-pic"
        alt=""
      />
      <div className="video-info">
        <div>
          <strong>{title}</strong>
          <p>{artist}</p>
        </div>
        {selectedVideoId === videoId ? (
          <div className="loader"></div>
        ) : (
          <FaPlayCircle size={25} />
        )}
      </div>
    </div>
  );
}
