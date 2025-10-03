import Main from "../layout/Main";
import Header from "../layout/Header";
import "../css/Home.css";
import { IoSearch } from "react-icons/io5";
import { use, useEffect, useState } from "react";
import { tags } from "../tags";
import VideoButton from "../components/VideoButton";
import { useVideo } from "../context/VideoContext";
import AdBanner from "../components/AdBanner";
import DOMPurify from "dompurify";
import { Navigate, useNavigate } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate de que este path sea correcto

export default function Home() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [typing, setTyping] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const {
    setVideosList,
    setSelectedVideo,
    selectedVideo,
    setVideoIndex,
    setSelectedTag,
    setVideosListName,
    setIsArtistVideosList
  } = useVideo();
  const [randomVideosArr, setRandomVideosArr] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  const [searchedVideoList, setSearchedVideoList] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const fbVideoList = querySnapshot.docs.map((doc) => doc.data());
        setRandomVideosArr(shuffleArray(fbVideoList));
        setVideos(fbVideoList);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      }
    };

    fetchVideos();
  }, []);

  // useEffect(() => {
  //   // setVideosList(randomVideosArr);
  //   console.log("HOME > VideosList: " + randomVideosArr);
  // }, [randomVideosArr]);

  // const navigate = useNavigate();
  const handleChange = (e) => {
    setTyping(e.target.value !== "");
    setSearchedVideoList(
      randomVideosArr.filter(
        (video) =>
          video.title?.toLowerCase().includes(searchedValue.toLowerCase()) ||
          video.artist?.toLowerCase().includes(searchedValue.toLowerCase()) ||
          video.tags
            ?.map((tag) => tag.toLowerCase())
            .includes(searchedValue.toLowerCase())
      )
    );
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
                    setVideosListName("#" + tag.name + " List");
                    navigate("/queue");
                    setIsArtistVideosList(false);
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
                      setVideosListName("Explore Section List");
                      setIsArtistVideosList(false);
                    }}
                    selectedVideoId={selectedVideo?.videoId}
                  />
                ))}
              </div>
              <button onClick={loadMoreSongs} className="btn-more-songs">
                View More Songs
              </button>
            </div>

            {/* <div className="AdContainer">
              <AdBanner />
            </div> */}
          </div>
        ) : (
          <div className="search-result-section">
            <p style={{ marginTop: "15px", fontSize: "14px", color: "gray" }}>
              Results for {searchedValue}
            </p>
            <div className="search-result-list">
              {searchedVideoList.map((video) => (
                <VideoButton
                  key={video.videoId}
                  videoId={video.videoId}
                  title={video.title}
                  artist={video.artist}
                  onClick={() => {
                    setSelectedVideo(video);
                    setSelectedTag({});
                    setVideosList(searchedVideoList);
                    setVideosListName("Searched Videos");
                    setIsArtistVideosList(false);
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
