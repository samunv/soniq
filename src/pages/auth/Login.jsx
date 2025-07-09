import { IoMdMusicalNote } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Auth.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState} from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email })
      );

      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="Auth">
      <div className="logo-soniq">
        <img src="img/soniq-logo.png" alt="" width={230} />
      </div>

      <form action="" className="login-form">
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
        <button className="btn-sign-in" onClick={handleLogin}>
          Sign In
        </button>
      </form>
      <p>or</p>
      <Link to={"/register"} className="sign-up-link">
        Sign Up
      </Link>
    </div>
  );
}
