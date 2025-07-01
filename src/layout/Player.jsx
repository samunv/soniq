import "../css/Player.css";
import YouTube from "react-youtube";
import { useRef, useState, useEffect } from "react";
import { FaCirclePause } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { useVideo } from "../context/VideoContext";

export default function Player({
  videoId,
  artist,
  title,
  videoPic,
  videosListForPlay,
}) {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { videosList, videoIndex, setVideoIndex, setSelectedVideo } =
    useVideo();

  useEffect(() => {
    console.log("PLAYER > VideosList:", videosList);
  }, [videosListForPlay]);

  const opts = {
    height: "80",
    width: "130",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());

    // Actualizar el tiempo actual cada segundo
    setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
  };

  const playVideo = () => {
    setPlaying(true);
    playerRef.current.playVideo();
  };

  const pauseVideo = () => {
    setPlaying(false);
    playerRef.current.pauseVideo();
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const nextVideo = () => {
    if (videoIndex < videosList.length - 1) {
      const newIndex = videoIndex + 1;
      setVideoIndex(newIndex);
      setSelectedVideo(videosList[newIndex]);
    }
  };

  const prevVideo = () => {
    if (videoIndex > 0) {
      const newIndex = videoIndex - 1;
      setVideoIndex(newIndex);
      setSelectedVideo(videosList[newIndex]);
    }
  };

  return (
    <div className="Player">
      <div
        className="bg-image"
        style={{ backgroundImage: `url('${videoPic}')` }}
      ></div>
      <div className="player-column">
        <div className="Track">
          <YouTube videoId={videoId} onReady={onReady} opts={opts} onEnd={nextVideo}/>
          <div className="track-info">
            <strong>{title}</strong>
            <p style={{ color: "lightgray" }}>{artist}</p>
          </div>
        </div>

        <div className="Controller">
          <div className="Controller-buttons">
            <IoPlaySkipBackSharp
              size={18}
              onClick={prevVideo}
              className="prev-next-buttons"
            />
            <div className="playing-pause-btns">
              {" "}
              {playing ? (
                <FaCirclePause size={30} onClick={pauseVideo} />
              ) : (
                <FaPlayCircle size={30} onClick={playVideo} />
              )}
            </div>
            <IoPlaySkipForwardSharp
              size={18}
              onClick={nextVideo}
              className="prev-next-buttons"
            />
          </div>

          <div className="progressBar">
            <p>{formatTime(currentTime)}</p>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              style={{
                "--progress": `${(currentTime / duration) * 100}%`,
              }}
            />
            <p>{formatTime(duration)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
