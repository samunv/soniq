import "../css/Player.css";
import YouTube from "react-youtube";
import { useRef, useState, useEffect } from "react";
import { FaCirclePause } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { useVideo } from "../context/VideoContext";
import { FaRandom } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
// import { useNavigate, useLocation } from "react-router";

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
  const [randomPlaying, setRandomPlaying] = useState(false);
  const [repeatVideo, setRepeatVideo] = useState(false);
  const [artView, setArtView] = useState(false);
  // const navigate = useNavigate();
  // const { pathname } = useLocation();

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

  const artViewOpts = {
    height: "300",
    width: "600",
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
    if (randomPlaying) {
      const newIndex = Math.floor(Math.random() * videosList.length);
      setVideoIndex(newIndex);
      setSelectedVideo(videosList[newIndex]);
    } else if (repeatVideo) {
      if (playerRef.current) {
        playerRef.current.seekTo(0); // vuelve al segundo 0
        playerRef.current.playVideo(); // lo reproduce
      }
    } else {
      if (videoIndex < videosList.length - 1) {
        const newIndex = videoIndex + 1;
        setVideoIndex(newIndex);
        setSelectedVideo(videosList[newIndex]);
      }
    }
  };

  const prevVideo = () => {
    if (videoIndex > 0) {
      const newIndex = videoIndex - 1;
      setVideoIndex(newIndex);
      setSelectedVideo(videosList[newIndex]);
    }
  };

  const handleRepeatVideo = () => {
    setRepeatVideo((prev) => !prev);
    if (!repeatVideo) setRandomPlaying(false);
  };

  const handleRandomPlaying = () => {
    setRandomPlaying((prev) => !prev);
    if (!randomPlaying) setRepeatVideo(false);
  };
  const handleArtView = () => {
    setArtView((prev) => !prev);
  };

  return (
    <div className={artView ? "ArtViewPlayer" : "Player"}>
      <div
        className="bg-image"
        style={{ backgroundImage: `url('${videoPic}')` }}
      ></div>
      <div className={artView ? "player-column-artview" : "player-column"}>
        <div className="Track">
          <div className="yt-video-container">
            <YouTube
              videoId={videoId}
              onReady={onReady}
              opts={artView ? artViewOpts : opts}
              onEnd={nextVideo}
              className="yt-video"
            />
          </div>

          <div className="track-info">
            <strong>{title}</strong>
            <p style={{ color: "lightgray" }}>{artist}</p>
          </div>
        </div>

        <div className="Controller">
          <div className="Controller-buttons">
            <FaRandom
              size={18}
              className={
                randomPlaying ? "activated-controll" : "prev-next-buttons"
              }
              onClick={handleRandomPlaying}
            />
            <IoPlaySkipBackSharp
              size={20}
              onClick={prevVideo}
              className="prev-next-buttons"
            />
            <div className="playing-pause-btns">
              {" "}
              {playing ? (
                <FaCirclePause size={32} onClick={pauseVideo} />
              ) : (
                <FaPlayCircle size={32} onClick={playVideo} />
              )}
            </div>
            <IoPlaySkipForwardSharp
              size={20}
              onClick={nextVideo}
              className="prev-next-buttons"
            />
            <FaRepeat
              size={18}
              className={
                repeatVideo ? "activated-controll" : "prev-next-buttons"
              }
              onClick={handleRepeatVideo}
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

        <div className="third-column">
          <ul className="third-column-row">
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
              </svg>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </li>
            <li onClick={handleArtView}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
                className={artView ? "icon-activated" : ""}
              >
                <path d="m480-420 240-160-240-160v320Zm28 220h224q-7 26-24 42t-44 20L228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v80l-36 5 54 437 290-36Zm-148-80q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Zm0-80h440v-440H360v440Zm220-220ZM218-164Z" />
              </svg>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
              </svg>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
