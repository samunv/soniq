import Header from "../layout/Header";
import Main from "../layout/Main";
import "../css/Profile.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useRef, useEffect } from "react";
import Modal from "../components/Modal";
import Overlay from "../components/Overlay";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import ColorThief from "color-thief-browser";

import { MdLogout } from "react-icons/md";
import { FastAverageColor } from "fast-average-color";

export default function Profile() {
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [logoutModal, setLogoutModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState(userData?.username || "");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(userData?.photo || "");
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef(null);
  const [dominantColor, setDominantColor] = useState(null);

  const imgbbApiKey = "243369439f9f662e618fd851bbd243f7";

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !imageUrl) return;

    const fac = new FastAverageColor();

    fac
      .getColorAsync(img)
      .then((color) => {
        setDominantColor(color.rgb);
      })
      .catch((e) => {
        console.error("Error FastAverageColor:", e);
      });
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUploadImage = async () => {
    if (!image) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      const url = res.data.data.url;
      setImageUrl(url);
      return url;
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (newUsername) => {
    try {
      let uploadedUrl = imageUrl;

      if (image) {
        const url = await handleUploadImage();
        if (url) uploadedUrl = url;
      }

      const userRef = doc(db, "users", userData?.uid);
      await updateDoc(userRef, {
        username: newUsername,
        photo: uploadedUrl,
      });

      const updatedUser = {
        ...userData,
        username: newUsername,
        photo: uploadedUrl,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditProfileModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="Profile">
      <Header />
      <Main>
        <h2>Profile</h2>
        <div
          className="profile-container"
          style={{
            backgroundImage: `linear-gradient(
    to bottom,
    ${dominantColor || "var(--bg-color)"},
    black
  )`,
          }}
        >
          <div
            className="user-data"
            onClick={() => setEditProfileModal(true)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={imageUrl}
              alt="profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              ref={imgRef}
              crossOrigin="anonymous"
            />
            <div className="user-info">
              <p style={{ fontSize: "16px", marginBottom: "10px", color:"white" }}>
                Contribution points:{" "}
                {userData.contributions ? userData.contributions : 0}
              </p>
              <h1>{userData.username}</h1>
              <p style={{ color: "white" }}>{userData.email}</p>
            </div>
          </div>
          <div className="buttons">
            <button
              className="btn-profile edit"
              onClick={() => setEditProfileModal(true)}
            >
              Edit Profile
              <MdEdit size={23} />
            </button>

            <button
              className="btn-profile log-out"
              onClick={() => setLogoutModal(true)}
            >
              Log Out
              <MdLogout size={25} />
            </button>
          </div>

          {logoutModal && (
            <>
              <Modal
                text="Are you sure you want to log out?"
                onClose={() => setLogoutModal(false)}
                onAction={handleLogout}
                onActionText="Yes"
              />
              <Overlay />
            </>
          )}

          {editProfileModal && (
            <>
              <Modal
                text="Edit Profile"
                onClose={() => setEditProfileModal(false)}
                onActionText="Save"
                onAction={() => handleSaveProfile(usernameInput)}
              >
                <div className="input-label-column">
                  <label htmlFor="name-user" className="edit-profile-label">
                    Username
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="edit-profile-input"
                    id="name-user"
                  />
                </div>

                <div className="input-label-column">
                  <label htmlFor="photo-user" className="edit-profile-label">
                    Photo
                  </label>
                  <input
                    type="file"
                    className="edit-profile-input"
                    onChange={handleFileChange}
                    id="photo-user"
                    accept="image/*"
                  />
                </div>

                {uploading && <p>Uploading image...</p>}
              </Modal>
              <Overlay />
            </>
          )}
        </div>
      </Main>
    </div>
  );
}
