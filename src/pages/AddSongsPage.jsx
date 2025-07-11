import Header from "../layout/Header";
import Main from "../layout/Main";
import "../css/AddSongsPage.css";
import Player from "./../layout/Player";

export default function AddSongsPage() {
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
            <label htmlFor="">Song Name or title</label>
            <input type="text" />

            <label htmlFor="">Artist or Author Name</label>
            <input type="text" />

            <label htmlFor="">YouTube Video URL</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=5SbpKO3jbJg&list=RD5SbpKO3jbJg&start_radio=1"
            />

            <label htmlFor="">Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="Type tags separated by commas (e.g., Chill, Party)"
              aria-label="Song tags"
            />
          </div>
        </div>
      </Main>
    </div>
  );
}
