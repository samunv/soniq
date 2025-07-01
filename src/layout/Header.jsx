import { NavLink } from "react-router-dom";
import "../css/Header.css";
import { IoMdMusicalNote } from "react-icons/io";
import { GoHomeFill } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
//import { useContext } from "react";
import { IoSearch } from "react-icons/io5";

export default function Header() {
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div className="Header">
      <div className="Header-logo">
        <Link to="/home">
          <img
            src="/img/soniq-logo.png"
            alt=""
            width={80}
            className="soniq-logo"
          />
        </Link>
      </div>
      <div className="Navigation">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `Header-link ${isActive ? "active" : ""}`
          }
        >
           <IoSearch size={25} />
        </NavLink>
        <NavLink
          to="/favs"
          className={({ isActive }) =>
            `Header-link ${isActive ? "active" : ""}`
          }
        >
          <FaHeart size={25} />
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `Header-link ${isActive ? "active" : ""}`
          }
        >
          <img src={userData.photo} className="profile-image" />
        </NavLink>
      </div>
    </div>
  );
}
