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
import { NavLink, useNavigate } from "react-router";
import { IoMdMore } from "react-icons/io";

// import { useNavigate, useLocation } from "react-router";ç
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FaHeart } from "react-icons/fa";

export default function Player({
  videoId,
  artist,
  title,
  videoPic,
  videosListForPlay,
  videoIndex,
  selectedTag,
}) {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [randomPlaying, setRandomPlaying] = useState(false);
  const [repeatVideo, setRepeatVideo] = useState(false);
  const [artView, setArtView] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userLikedSongs = userData.likedSongs;
  const [videos, setVideos] = useState([]);
  // const navigate = useNavigate();
  // const { pathname } = useLocation();

  const navigate = useNavigate();

  const {
    setVideoIndex,
    setSelectedVideo,
    videosListName,
    selectedVideo,
    setVideosList,
    setVideosListName,
    setIsArtistVideosList,
  } = useVideo();

  useEffect(() => {
    console.log("PLAYER > VideosList:", videosListForPlay);
    console.log("VideoIndex Player>> :", videoIndex);
    console.log("VideoListLenght: ", videosListForPlay.length);
    setPlaying(true);
  }, [videosListForPlay, videoIndex, setPlaying]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const fbVideoList = querySnapshot.docs.map((doc) => doc.data());
        setVideos(fbVideoList);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      }
    };

    fetchVideos();
  }, []);

  // useEffect(() => {
  //   setLikedSongsArray(userData.likedSongs);
  //   console.log(likedSongsArray);
  //   const likedSong = likedSongsArray.includes(videoId);
  //   if(likedSong){
  //     setIsLiked(true);
  //   }
  // }, [likedSongsArray]);

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        const time = playerRef.current?.getCurrentTime?.();

        if (typeof time === "number") {
          setCurrentTime(time);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    const liked = userData?.likedSongs?.includes(videoId);
    setIsLiked(liked);
  }, [videoId]);

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

  // const onReady = (event) => {
  //   event.target.setVolume(volume);
  //   playerRef.current = event.target;
  //   setDuration(event.target.getDuration());
  //   setInterval(() => {
  //     if (playerRef.current && playerRef.current.getCurrentTime) {
  //       setCurrentTime(playerRef.current.getCurrentTime());
  //     }
  //   }, 1000);
  // };

  const onReady = (event) => {
    event.target.setVolume(volume);
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
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
      const newIndex = Math.floor(Math.random() * videosListForPlay.length);
      setVideoIndex(newIndex);
      setSelectedVideo(videosListForPlay[newIndex]);
    } else if (repeatVideo) {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      const newIndex = videoIndex + 1;
      if (newIndex < videosListForPlay.length) {
        setVideoIndex(newIndex);
        setSelectedVideo(videosListForPlay[newIndex]);
      } else {
        if (videosListForPlay.length > 0) {
          setVideoIndex(0);
          setSelectedVideo(videosListForPlay[0]);
        }
      }
    }
  };

  const prevVideo = () => {
    if (videoIndex > 0) {
      const newIndex = videoIndex - 1;
      setVideoIndex(newIndex);
      setSelectedVideo(videosListForPlay[newIndex]);
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

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume); // Establece el volumen del reproductor
    }
  };

  const HandleLikeVideo = async () => {
    const userRef = doc(db, "users", userData.uid);
    if (!isLiked) {
      setIsLiked(true);
      try {
        await updateDoc(userRef, {
          likedSongs: arrayUnion(videoId),
        });

        // Update localStorage with the new likedSongs list
        const newLikedSongs = [...userData.likedSongs, videoId];
        const newUserData = { ...userData, likedSongs: newLikedSongs };
        localStorage.setItem("user", JSON.stringify(newUserData));
      } catch (error) {
        console.error("Error al dar like:", error);
      }
    } else if (isLiked) {
      setIsLiked(false);
      await updateDoc(userRef, {
        likedSongs: arrayRemove(videoId),
      });

      const newLikedSongs = userData.likedSongs.filter((id) => id !== videoId);
      const newUserData = { ...userData, likedSongs: newLikedSongs };
      localStorage.setItem("user", JSON.stringify(newUserData));
    }
  };

  return (
    <div className={artView ? "ArtViewPlayer" : "Player"}>
      <div
        className="bg-image"
        style={{ backgroundImage: `url('${videoPic}')` }}
      ></div>

      <div className={artView ? "player-column-artview" : "player-column"}>
        {artView ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
            className="cross-icon"
            onClick={handleArtView}
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        ) : (
          ""
        )}
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
            <span style={{ fontSize: "14px" }}>{title}</span>
            <p
              style={{ color: "lightgray" }}
              className="artistNameLink"
              onClick={() => {
                const filteredArtistVideoList = videos.filter(
                  (video) =>
                    video.artist === artist ||
                    video.title.toLowerCase().includes(artist.toLowerCase()) ||
                    video.tags.some(
                      (tag) => tag.toLowerCase() === artist.toLowerCase()
                    )
                );
                setIsArtistVideosList(true);
                setVideosList(filteredArtistVideoList);
                setVideosListName(artist);
                navigate("/queue");
                setArtView(false);
              }}
            >
              {artist}
            </p>
          </div>
        </div>

        <div className="Controller">
          <div className="Controller-buttons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
              className={
                randomPlaying ? "activated-controll" : "prev-next-buttons"
              }
              onClick={handleRandomPlaying}
            >
              <path d="M560-160v-80h104L537-367l57-57 126 126v-102h80v240H560Zm-344 0-56-56 504-504H560v-80h240v240h-80v-104L216-160Zm151-377L160-744l56-56 207 207-56 56Z" />
              <title>Turn on shuffle</title>
            </svg>

            <IoPlaySkipBackSharp
              size={20}
              onClick={prevVideo}
              className="prev-next-buttons"
              title="Previous"
            />
            <div className="playing-pause-btns">
              {playing ? (
                <FaCirclePause size={32} onClick={pauseVideo} title="Pause" />
              ) : (
                <FaPlayCircle size={32} onClick={playVideo} title="Play" />
              )}
            </div>
            <IoPlaySkipForwardSharp
              size={20}
              onClick={nextVideo}
              className="prev-next-buttons"
              title="Next"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
              className={
                repeatVideo ? "activated-controll" : "prev-next-buttons"
              }
              onClick={handleRepeatVideo}
            >
              <path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" />
              <title>Activate repeat</title>
            </svg>
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
            <li onClick={HandleLikeVideo}>
              <FaHeart
                size={20}
                style={{
                  color: `${isLiked ? "var(--primary-color)" : "white"}`,
                }}
              />
            </li>

            {videosListForPlay.length > 0 ? (
              <li onClick={() => setArtView(false)} title="View in Queue">
                <NavLink
                  to={"/queue"}
                  className={({ isActive }) =>
                    `queue-icon ${isActive ? "active" : ""}`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M640-160q-50 0-85-35t-35-85q0-50 35-85t85-35q11 0 21 1.5t19 6.5v-328h200v80H760v360q0 50-35 85t-85 35ZM120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Z" />
                  </svg>
                </NavLink>
              </li>
            ) : (
              ""
            )}

            <li
              onClick={handleArtView}
              title={artView ? "Quit Inmersive View" : "Inmersive View"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="25px"
                viewBox="0 -960 960 960"
                width="25px"
                fill="#FFFFFF"
                className={artView ? "icon-activated" : ""}
              >
                <path d="m480-420 240-160-240-160v320Zm28 220h224q-7 26-24 42t-44 20L228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v80l-36 5 54 437 290-36Zm-148-80q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Zm0-80h440v-440H360v440Zm220-220ZM218-164Z" />
              </svg>
            </li>
            <li title="Volume Control">
              {volume === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                  viewBox="0 -960 960 960"
                  width="25px"
                  fill="#FFFFFF"
                >
                  <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
                </svg>
              ) : volume > 0 && volume <= 40 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                  viewBox="0 -960 960 960"
                  width="25px"
                  fill="#FFFFFF"
                >
                  <path d="M200-360v-240h160l200-200v640L360-360H200Zm440 40v-322q45 21 72.5 65t27.5 97q0 53-27.5 96T640-320ZM480-606l-86 86H280v80h114l86 86v-252ZM380-480Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
                </svg>
              )}

              <input
                type="range"
                min="0"
                max="100"
                value={volume ?? ""}
                onChange={handleVolumeChange}
                className="volume-range"
                style={{
                  background: `linear-gradient(to right, var(--primary-color) ${volume}%, #ccc ${volume}%)`,
                }}
              />
            </li>
          </ul>
        </div>

        <div className="mobile-controller">
          {playing ? (
            <FaCirclePause size={32} onClick={pauseVideo} title="Pause" />
          ) : (
            <FaPlayCircle size={32} onClick={playVideo} title="Play" />
          )}

          <IoPlaySkipForwardSharp
            size={20}
            onClick={nextVideo}
            className="prev-next-buttons"
            title="Next"
          />
        </div>
      </div>
    </div>
  );
}
