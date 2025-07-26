import { IoMdMusicalNote } from "react-icons/io";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../../css/Auth.css";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        createdOn: new Date(),
        photo:
          "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg", // Default profile image
        playlists: [],
        likedSongs: [],
        suscribtion: "free",
        contributions:0,
        languague: "en",
      });

      alert("Success! Your Soniq account has been created.");
      navigate("/");
    } catch (error) {
      console.error("Sign up error", error);
      if (error.message.includes("email-already-in-use")) {
        alert("This email is already in use. Please try another one.");
        setUsername("");
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <div className="Auth">
      <div
        className="register-text"
        width={500}
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "40px" }}>Create your</h1>
        <img src="img/soniq-logo.png" alt="" width={100} />
        <h1
          style={{
            textAlign: "center",
            fontSize: "40px",
            color:"var(--primary-color)"
            
          }}
        >
          Account
        </h1>
      </div>
      <h1 style={{ textAlign: "center", fontSize: "40px" }}>and play Music</h1>
      <form action="" className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-sign-in" onClick={handleRegister}>
          Sign Up
        </button>
      </form>
      <p>or</p>
      <Link to={"/"} className="sign-up-link">
        Sign In
      </Link>
    </div>
  );
}
