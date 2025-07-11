import { createContext, useState, useContext, useEffect } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [selectedVideo, setSelectedVideo] = useState(() => {
    const storedVideo = localStorage.getItem("selectedVideo");
    return storedVideo ? JSON.parse(storedVideo) : null;
  });
  const [videosList, setVideosList] = useState(()=>{
    const storedVideosList = localStorage.getItem("selectedVideosList");
    return storedVideosList ? JSON.parse(storedVideosList) : null;
  });
  const [videoIndex, setVideoIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState({});
  const [videosListName, setVideosListName] = useState(()=>{
    const storedVideosListName = localStorage.getItem("selectedVideosListName");
    return storedVideosListName ? storedVideosListName: "";
  });
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [playlistData, setPlayListData] = useState({});

  useEffect(() => {
    if (selectedVideo && videosList) {
      localStorage.setItem("selectedVideo", JSON.stringify(selectedVideo));
      localStorage.setItem("selectedVideosList", JSON.stringify(videosList));
      localStorage.setItem("selectedVideosListName", videosListName);
    } else {
      localStorage.removeItem("selectedVideo");
      localStorage.removeItem("selectedVideosList");
      localStorage.removeItem("selectedVideosListName");
      
    }
    if (selectedVideo !== null) {
      setCurrentVideoId(selectedVideo.videoId);
    }
  }, [selectedVideo, videosList]);

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
