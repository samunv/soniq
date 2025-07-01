import { useParams, Link } from "react-router";
import Header from "../layout/Header";
import Main from "../layout/Main";

export default function TagPage() {
  const { tag } = useParams();
  return (
    <div className="TagPage">
      <Header />
      <Main>
        <Link
          to={"/home"}
          style={{
            textDecoration: "none",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
          }}
          onMouseOver={(e) => {
            e.target.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.target.style.textDecoration = "none";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25px"
            viewBox="0 -960 960 960"
            width="25px"
            fill="#FFFFFF"
          >
            <path d="M424-56 0-480l424-424 80 81-343 343 343 343-80 81Z" />
          </svg>
          <h2>Listen to {tag} music</h2>
        </Link>
      </Main>
    </div>
  );
}
