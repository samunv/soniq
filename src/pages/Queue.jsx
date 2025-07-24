import { useVideo } from "../context/VideoContext";
import Header from "../layout/Header";
import Main from "../layout/Main";
import "../css/Queue.css";
import { FaPlayCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";

export default function Queue() {
  const {
    videosList,
    videosListName,
    currentVideoId,
    setSelectedVideo,
    setVideoIndex,
    playlistData,
    selectedVideo,
    isArtistVideosList,
  } = useVideo();
  const [dominantColor, setDominantColor] = useState(null);
  const imgRef = useRef(null);
  const [artistPhoto, setArtistPhoto] = useState("");

  const videoRefs = useRef({});

  useEffect(() => {
    const selectedRef = videoRefs.current[currentVideoId];
    if (selectedRef) {
      selectedRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentVideoId]);

  useEffect(() => {
    const getArtistPhoto = async () => {
      try {
        const response = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://api.deezer.com/search/artist?q=${videosListName}`
        );
        const data = await response.json();

        const lastImage = data?.data[0]?.picture_medium;
        if (lastImage) {
          setArtistPhoto(lastImage);
        } else {
          setArtistPhoto(""); // Limpia si no hay imagen
        }
      } catch (error) {
        console.error("Error:", error);
        setArtistPhoto(""); // Maneja error limpiando imagen
      }
    };

    if (isArtistVideosList && videosListName) {
      getArtistPhoto();
    }
  }, [videosListName]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const fac = new FastAverageColor();

    fac
      .getColorAsync(img)
      .then((color) => {
        setDominantColor(color.rgb);
      })
      .catch((e) => {
        console.error("Error FastAverageColor:", e);
      });
  });
  return (
    <>
      <Header />
      <Main>
        <div className="Queue-Row">
          <div className={`first-column`}>
            <div className={`${isArtistVideosList ? "artist-row" : ""}`}>
              {isArtistVideosList && artistPhoto!=="" ? (
                <img
                  src= {artistPhoto}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    borderRadius: "50%",
                  }}
                />
              ): (
                ""
              )}
              <div>
                <h2>{videosListName || "List"}</h2>
                <p
                  style={{
                    color: "gray",
                    fontFamily: "inter-extrabold",
                    fontSize: "20px",
                  }}
                >
                 {isArtistVideosList ? "Artist": "Queue"} • {videosList.length} songs{" "}
                </p>
              </div>
            </div>
            <div
              className="queue-art-container"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${dominantColor}, black)`,
              }}
            >
              <img
                src={
                  playlistData !== null
                    ? `https://img.youtube.com/vi/${selectedVideo.videoId}/mqdefault.jpg`
                    : playlistData.image
                }
                alt=""
                ref={imgRef}
                crossOrigin="anonymous"
                className="queue-art"
              />
              <p
                style={{
                  fontFamily: "inter-bold",
                  color: "lightgray",
                  marginTop: "10px",
                }}
              >
                Playing: {selectedVideo.title} • {selectedVideo.artist}
              </p>
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
                ref={(el) => (videoRefs.current[video.videoId] = el)}
              >
                <div className="video-row-first-column">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    className="video-row-pic"
                    alt=""
                  />
                  <div>
                    <span>{video.title}</span>
                    <p>{video.artist}</p>
                  </div>
                </div>
                {currentVideoId === video.videoId ? (
                  <div
                    className="loader"
                    style={{ color: "var(--primary-color)" }}
                  ></div>
                ) : (
                  <FaPlayCircle size={22} />
                )}
              </div>
            ))}
          </div>
        </div>
      </Main>
    </>
  );
}
