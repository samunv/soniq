import Header from "../layout/Header";
import Main from "../layout/Main";
import { AuthContext } from "../context/AuthContext";
import "../css/Profile.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import Modal from "../components/Modal";
import Overlay from "../components/Overlay";

export default function Profile() {
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };
  return (
    <div className="Profile">
      <Header />
      <Main>
        <h2>Profile</h2>
        <div className="user-data">
          <img
            src={userData.photo}
            style={{ width: "150px", borderRadius: "50%" }}
          />
          <div className="user-info">
            <h1>{userData.username}</h1>
            <p>{userData.email}</p>
          </div>
        </div>
        <div className="buttons">
          <button className="btn-profile edit">
            Edit Profile
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25px"
              viewBox="0 -960 960 960"
              width="25px"
              fill="#FFFFFF"
            >
              <path d="M188-189h45l421-420-43-44-423 421v43ZM95-95v-176l573-573q9-10 22.36-15.5Q703.71-865 718-865q13 0 26 5.5t25 14.5l77 74q10 12 15 25.5t5 27.5q0 14-5.5 27.5T846-667L272-95H95Zm668-624-42-43 42 43Zm-130 87-22-21 43 44-21-23Z" />
            </svg>
          </button>
          <button
            className="btn-profile log-out"
            onClick={() => setLogoutModal(true)}
          >
            Log Out{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25px"
              viewBox="0 -960 960 960"
              width="25px"
              fill="#FFFFFF"
            >
              <path d="M189-95q-39.05 0-66.53-27.47Q95-149.95 95-189v-582q0-39.46 27.47-67.23Q149.95-866 189-866h296v95H189v582h296v94H189Zm467-174-67-66 97-98H354v-94h330l-97-98 67-66 212 212-210 210Z" />
            </svg>
          </button>
        </div>

        {logoutModal ? (
          <>
            <Modal
              text={"Are you sure you want to log out?"}
              onClose={() => setLogoutModal(false)}
              onAction={handleLogout}
            />
            <Overlay />
          </>
        ) : (
          ""
        )}
      </Main>
    </div>
  );
}
