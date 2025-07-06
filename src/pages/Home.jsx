import Main from "../layout/Main";
import Header from "../layout/Header";
import "../css/Home.css";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { tags } from "../tags";
import { videos } from "../videos";
import VideoButton from "../components/VideoButton";
import { useVideo } from "../context/VideoContext";
import AdBanner from "../components/AdBanner";
import DOMPurify from "dompurify";

export default function Home() {
  const [typing, setTyping] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const {
    setVideosList,
    setSelectedVideo,
    selectedVideo,
    setVideoIndex,
    setSelectedTag,
  } = useVideo();
  const [randomVideosArr, setRandomVideosArr] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); 

  useEffect(() => {
    setRandomVideosArr(shuffleArray(videos));
  }, [videos]);

  // useEffect(() => {
  //   // setVideosList(randomVideosArr);
  //   console.log("HOME > VideosList: " + randomVideosArr);
  // }, [randomVideosArr]);

  // const navigate = useNavigate();
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

  const loadMoreSongs = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <div className="Home">
      <Header />
      <Main>
        <div className="search-box">
          <IoSearch size={25} />
          <input
            type="text"
            placeholder="Search songs, artists..."
            onChange={(e) => handleChange(e)}
            value={searchedValue}
            onInput={(e) => {
              setSearchedValue(e.target.value);
            }}
          />
        </div>

        {!typing ? (
          <div className="initial-layout">
            <div className="tag-clasification">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="tag"
                  style={{ "--hover-color": tag.color }}
                  onClick={() => {
                    const filteredTagVideoList = videos.filter((video) =>
                      video.tags?.some((t) => t === tag.name)
                    );
                    const randomVideosListofTag =
                      shuffleArray(filteredTagVideoList);
                    setVideosList(randomVideosListofTag);
                    setSelectedVideo(randomVideosListofTag[0]);
                    setSelectedTag({ tagName: tag.name, tagColor: tag.color });
                    setVideoIndex(0);
                  }}
                >
                  <div className="tag-img-wrapper">
                    {/* <img
                      src={"img/" + tag.img}
                      alt={tag.name}
                      className="tag-img"
                    /> */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(tag.svgIcon),
                      }}
                      className="svg-container"
                    ></div>
                  </div>
                  <p>{tag.name}</p>
                </div>
              ))}
            </div>

            <div className="explore-section">
              <h2 style={{ fontFamily: "inter-extrabold" }}>Explore Music</h2>
              <div className="explore-list">
                {randomVideosArr.slice(0, visibleCount).map((video, index) => (
                  <VideoButton
                    key={video.videoId}
                    videoId={video.videoId}
                    title={video.title}
                    artist={video.artist}
                    onClick={() => {
                      setSelectedVideo(video);
                      setVideosList(randomVideosArr);
                      setVideoIndex(index);
                      setSelectedTag({});
                    }}
                    selectedVideoId={selectedVideo?.videoId}
                  />
                ))}
              </div>
              <button onClick={loadMoreSongs} className="btn-more-songs">
                View More Songs
              </button>
            </div>

            <div className="AdContainer">
              <AdBanner />
            </div>
          </div>
        ) : (
          <div className="search-result-section">
            <p style={{ marginTop: "15px", fontSize: "16px", color: "gray" }}>
              Results for {searchedValue}
            </p>
            <div className="search-result-list">
              {randomVideosArr
                .filter(
                  (video) =>
                    video.title
                      ?.toLowerCase()
                      .includes(searchedValue.toLowerCase()) ||
                    video.artist
                      ?.toLowerCase()
                      .includes(searchedValue.toLowerCase()) ||
                    video.tags
                      ?.map((tag) => tag.toLowerCase())
                      .includes(searchedValue.toLowerCase())
                )
                .map((video) => (
                  <VideoButton
                    key={video.videoId}
                    videoId={video.videoId}
                    title={video.title}
                    artist={video.artist}
                    onClick={() => {
                      setSelectedVideo(video);
                      setSelectedTag({});
                    }}
                    selectedVideoId={selectedVideo?.videoId}
                  />
                ))}
            </div>
          </div>
        )}
      </Main>
    </div>
  );
}
