import { createContext, useState, useContext } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videosList, setVideosList] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);

  return (
    <VideoContext.Provider value={{ selectedVideo, setSelectedVideo, videosList, setVideosList, videoIndex, setVideoIndex}}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  return useContext(VideoContext);
}
