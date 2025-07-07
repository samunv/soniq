import { createContext, useState, useContext, useEffect } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [selectedVideo, setSelectedVideo] = useState(() => {
    const storedVideo = localStorage.getItem("selectedVideo");
    return storedVideo ? JSON.parse(storedVideo) : null;
  });
  const [videosList, setVideosList] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState({});
  const [videosListName, setVideosListName] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [playlistData, setPlayListData] = useState({});

  useEffect(() => {
    if (selectedVideo) {
      localStorage.setItem("selectedVideo", JSON.stringify(selectedVideo));
    } else {
      localStorage.removeItem("selectedVideo");
    }
    setCurrentVideoId(selectedVideo.videoId);
  }, [selectedVideo]);

  return (
    <VideoContext.Provider
      value={{
        selectedVideo,
        setSelectedVideo,
        videosList,
        setVideosList,
        videoIndex,
        setVideoIndex,
        selectedTag,
        setSelectedTag,
        videosListName,
        setVideosListName,
        currentVideoId,
        setCurrentVideoId,
        playlistData,
        setPlayListData,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  return useContext(VideoContext);
}
