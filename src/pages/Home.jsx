import Main from "../layout/Main";
import Header from "../layout/Header";
import "../css/Home.css";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { tags } from "../tags";
import { useNavigate } from "react-router";
import YouTubePlayer from "../layout/YoutubePlayer";
import { videos } from "../videos";
import VideoButton from "../components/VideoButton";
import { useVideo } from "../context/VideoContext";

export default function Home() {
  const [typing, setTyping] = useState(false);
  const { videosList, setVideosList, setSelectedVideo, selectedVideo } =
    useVideo();
  const [randomVideosArr, setRandomVideosArr] = useState([]);

  useEffect(() => {
    setRandomVideosArr(shuffleArray(videos));
  }, [videos]);

  useEffect(() => {
    setVideosList(randomVideosArr);
    console.log("HOME > VideosList: " + randomVideosArr);
  }, [randomVideosArr]);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setTyping(e.target.value !== "");
  };

  function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  return (
    <div className="Home">
      <Header />
      <Main>
        <div className="search-box">
          <IoSearch size={25} />
          <input
            type="text"
            placeholder="Search songs, artists, tags..."
            onChange={(e) => handleChange(e)}
          />
        </div>

        {!typing ? (
          <div className="initial-layout">
            <div className="tag-clasification">
              {tags.map((tag, index) => (
                <div
                  className="tag"
                  key={index}
                  onClick={() => {
                    navigate(`/tag/${tag.name}`);
                  }}
                >
                  <img
                    src={"img/" + tag.img}
                    alt={tag.name}
                    style={{ width: "70px", borderRadius: "50%" }}
                  />
                  <p>#{tag.name}</p>
                </div>
              ))}
            </div>

            <div className="explore-section">
              <h2 style={{ fontFamily: "inter-extrabold" }}>Explore Music</h2>
              <div className="explore-list">
                {randomVideosArr.map((video, index) => (
                  <VideoButton
                    key={video.videoId}
                    videoId={video.videoId}
                    title={video.title}
                    artist={video.artist}
                    onClick={() => setSelectedVideo(video)}
                    selectedVideoId={selectedVideo?.videoId}
                    videoIndex={index}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Main>
    </div>
  );
}
