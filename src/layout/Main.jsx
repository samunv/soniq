import "../css/Main.css";
import Library from "../pages/Library";
import Player from "./Player";

export default function Main({ children, style }) {
  return (
    <div className="Main">
      <div className="Main-Right" style={style}>
        {children}
      </div>
      <Library />
    </div>
  );
}
