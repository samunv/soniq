import { useVideo } from "../context/VideoContext";
import Header from "../layout/Header";
import Main from "../layout/Main";
import "../css/Queue.css";
import { FaPlayCircle } from "react-icons/fa";

export default function Queue() {
  const {
    videosList,
    videosListName,
    currentVideoId,
    setSelectedVideo,
    selectedVideo,
    setVideoIndex,
    playlistData,
  } = useVideo();

  return (
    <>
      <Header />
      <Main>
        <div className="Queue-Row">
          <div>
            <h2>{videosListName}</h2>
            <p
              style={{
                color: "gray",
                fontFamily: "inter-extrabold",
                fontSize: "20px",
              }}
            >
              Music queue • {videosList.length} songs{" "}
            </p>
            <div className="queue-art-container">
              <img
                src={
                  playlistData !== null
                    ? `https://img.youtube.com/vi/${selectedVideo.videoId}/mqdefault.jpg`
                    : playlistData.image
                }
                alt=""
                className="queue-art"
              />
            </div>
          </div>
          <div className="queue-videos-list">
            {videosList.map((video, index) => (
              <div
                className={`video-row-button ${
                  currentVideoId === video.videoId ? "playing" : ""
                }
                     `}
                onClick={() => {
                  setSelectedVideo(video);
                  setVideoIndex(index);
                }}
              >
                <div className="video-row-first-column">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    className="video-row-pic"
                    alt=""
                  />
                  <div>
                    <strong>{video.title}</strong>
                    <p>{video.artist}</p>
                  </div>
                </div>
                {currentVideoId === video.videoId ? (
                  <div
                    className="loader"
                    style={{ color: "var(--primary-color)" }}
                  ></div>
                ) : (
                  <FaPlayCircle size={25} />
                )}
              </div>
            ))}
          </div>
        </div>
      </Main>
    </>
  );
}
