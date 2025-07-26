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
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");
  const [tags, setTags] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

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

      await addDoc(collection(db, "videos"), {
        title: songName,
        artist: artistName,
        videoId: extractedVideoId,
        tags: tags.split(",").map((tag) => tag.trim()),
        uploadedAt: new Date(),
      });

      const userRef = doc(db, "users", userData?.uid);
      await updateDoc(userRef, {
        contributions: (userData?.contributions || 0) + 30,
      });

      console.log("Video agregado correctamente.");
      window.location.href = "/home";
    } catch (error) {
      console.error("Error al agregar el video: ", error);
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
              Add your songs and let others play them!
            </h3>
          </div>
          <div className="form-add-songs">
            <div className="form-group">
              <label htmlFor="title">Song Name or title</label>
              <input
                type="text"
                required
                id="title"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              {" "}
              <label htmlFor="artist">Artist or Author Name</label>
              <input
                type="text"
                required
                id="artist"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                minLength={3}
                maxLength={30}
              />
            </div>
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
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="Type tags separated by commas (e.g., Chill, Party)"
                aria-label="Song tags"
                required
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
          {songName && artistName && youtubeURL && tags ? (
            <button onClick={handleCreateSong} className="btn-add">
              Add this song (+ 30 contribution points)
            </button>
          ) : (
            ""
          )}
        </div>
      </Main>
    </div>
  );
}
