import YouTube from "react-youtube";
import { useRef } from "react";

export default function YoutubePlayer({ videoId }) {
  const playerRef = useRef(null);

   const opts = {
    height: "110",
    width: "180",
    playerVars: {
      autoplay: 1,      // Auto reproduce al cargar
      controls: 0,      // Mostrar controles (opcional)
      modestbranding: 1,
      rel: 0,
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const playVideo = () => {
    playerRef.current.playVideo();
  };

  const pauseVideo = () => {
    playerRef.current.pauseVideo();
  };

  return (
    <>
      <YouTube videoId={videoId} onReady={onReady} opts={opts} />
      <button onClick={playVideo}>Play</button>
      <button onClick={pauseVideo}>Pause</button>
    </>
  );
}
