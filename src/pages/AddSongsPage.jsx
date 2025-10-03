import Header from "../layout/Header";
import Main from "../layout/Main";
import "../css/AddSongsPage.css";
import Player from "./../layout/Player";
import { useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default function AddSongsPage() {
  const [youtubeURL, setYoutubeURL] = useState("");
  const [tags, setTags] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  function getVideoData(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyCtuMnr3LUSgrCW6hQKuE9XNBa_o9XawNM`;

    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const video = data.items[0];
        if (!video) throw new Error("Video no encontrado");
        return {
          title: video.snippet.title,
          artist: video.snippet.channelTitle,
        };
      });
  }

  async function handleCreateSong() {
    const extractedVideoId = getYouTubeVideoId(youtubeURL);
    if (!extractedVideoId) {
      setIsError(true);
      setErrorMessage("Invalid YouTube URL. Please provide a valid URL.");
      return;
    }

    try {
      const q = query(
        collection(db, "videos"),
        where("videoId", "==", extractedVideoId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsError(true);
        setErrorMessage(
          "This video is already added. Please choose another one."
        );
        return;
      }

      const videoData = await getVideoData(extractedVideoId);

      if (!videoData.title || !videoData.artist) {
        setIsError(true);
        setErrorMessage("Error fetching video data. Please try again.");
        return;
      }

      await addDoc(collection(db, "videos"), {
        title: videoData.title,
        artist: videoData.artist,
        videoId: extractedVideoId,
        tags: tags.split(",").map((tag) => tag.trim()),
        uploadedAt: new Date(),
        uploadedBy: userData?.uid || "anonymous",
      });

      const userRef = doc(db, "users", userData?.uid);
      await updateDoc(userRef, {
        contributions: (userData?.contributions || 0) + 30,
      });

      alert("Video uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  function getYouTubeVideoId(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  return (
    <div className="AddSongsPage">
      <Header />
      <Main>
        <h2>Add Songs</h2>
        <div className="add-songs-content">
          <div className="infoSquare">
            <h3
              style={{
                fontFamily: "inter-extrabold",
                fontSize: "40px",
                width: "400px",
              }}
            >
              Contribute to our community, add songs!
            </h3>
          </div>

          <div className="form-add-songs">
            <div className="form-group">
              {" "}
              <label htmlFor="url">YouTube Video URL</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=5SbpKO3jbJg&list=RD5SbpKO3jbJg&start_radio=1"
                required
                id="url"
                value={youtubeURL}
                onChange={(e) => setYoutubeURL(e.target.value)}
              />
              <p style={{ fontSize: "14px", color: "#666" }}>
                Type de YouTube URL and automatically fetch the song's data.
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="Type tags separated by commas (e.g., Chill, Party)"
                aria-label="Song tags"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                minLength={50}
              />
            </div>
          </div>
          {isError && (
            <div style={{ marginTop: "10px" }} className="error-message">
              <p style={{ color: "red" }}>{errorMessage}</p>
            </div>
          )}
          {youtubeURL ? (
            <button onClick={handleCreateSong} className="btn-add">
              Add this song (+30 contribution points)
            </button>
          ) : (
            ""
          )}
        </div>
      </Main>
    </div>
  );
}

//AIzaSyCtuMnr3LUSgrCW6hQKuE9XNBa_o9XawNM
