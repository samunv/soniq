import "../css/Library.css";
import { IoMdAdd } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useVideo } from "../context/VideoContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Library() {
  const {
    setVideosList,
    setVideoIndex,
    setSelectedVideo,
    setVideosListName,
    setIsArtistVideosList,
  } = useVideo();
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userLikedSongs = userData.likedSongs;
  const [userLikedSongsVideosList, setUserLikedSongsVideosList] = useState([]);
  const navigate = useNavigate();

  const getUserLikedSongsVideos = async (likedSongs) => {
    if (!likedSongs || likedSongs.length === 0) return [];

    try {
      const chunked = chunkArray(likedSongs, 10);
      let videos = [];

      for (const chunk of chunked) {
        const selectVideosQuery = query(
          collection(db, "videos"),
          where("videoId", "in", chunk)
        );
        const querySnapshot = await getDocs(selectVideosQuery);
        const videosChunk = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        videos = [...videos, ...videosChunk];
      }

      return videos;
    } catch (error) {
      console.error("Error getting liked videos:", error);
      return [];
    }
  };

  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  useEffect(() => {
    const fetchLikedVideos = async () => {
      const likedVideos = await getUserLikedSongsVideos(userLikedSongs);
      setUserLikedSongsVideosList(likedVideos);
      console.log("Liked Songs Videos List:", likedVideos);
    };

    if (userLikedSongs) {
      fetchLikedVideos();
    }
  }, []);

  return (
    <div className="Library library-desktop">
      <h2>Playlists</h2>
      <div className="LibraryColumn">
        <div
          className="PlaylistContainer"
          onClick={() => {
            alert("This feature is not implemented yet.");
          }}
        >
          <div className="Square">
            <IoMdAdd size={30} />
          </div>
          <p>Create a Playlist</p>
        </div>
        <div
          className="PlaylistContainer likedSongs"
          onClick={() => {
            if (userLikedSongsVideosList.length === 0) {
              alert("You have no liked songs yet.");
              return;
            } else {
              setIsArtistVideosList(false);
              setVideosList(userLikedSongsVideosList);
              setVideosListName("Liked Songs");
              navigate("/queue");
            }
          }}
        >
          <div className="Square">
            <FaHeart size={25} />
          </div>
          <div>
            <p>Liked Songs</p>
            {userLikedSongsVideosList.length > 0 ? (
              <p style={{ color: "gray" }}>
                {userLikedSongsVideosList.length} songs
              </p>
            ) : (
             ""
            )}
          </div>
        </div>

        <hr style={{ borderColor: "rgb(58, 58, 58)" }} />
      </div>
    </div>
  );
}
