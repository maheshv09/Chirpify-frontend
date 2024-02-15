import React, { useEffect, useState } from "react";
import twitterImg from "../../assets/images/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../firebase-init";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../helper";
import { ref, set } from "firebase/database";
import { getDatabase, onValue } from "firebase/database";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const database = getDatabase(); // Initialize the Realtime Database
  useEffect(() => {
    console.log("Heyyy", database);
    const rootRef = ref(database);
    console.log("HEYY", rootRef);
    onValue(rootRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Database Contents:", data);
      } else {
        console.log("No data available.");
      }
    });
  }, [database]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new user with email and password
      const authUser = await createUserWithEmailAndPassword(email, password);
      const userId = authUser.user.uid;

      // Create a user object with additional details
      const user = {
        userId: userId,
        username: username,
        name: name,
        email: email,
        allowedTweets: 1,
      };
      const { data } = axios.post(`${BASE_URL}/register`, user);
      console.log(data);
      // Store user details in the Realtime Database
      const email1 = email.split("@")[0];
      const usersRef = ref(database, `users/${email1}`);
      set(usersRef, user);

      // Create a login attempts node for the user
      const attemptsRef = ref(database, `loginAttempts/${email1}`);
      set(attemptsRef, 0); // Initialize the login attempts to 0

      console.log("User registered successfully:", user);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  if (user || googleUser) {
    navigate("/");
    console.log(user);
    console.log(googleUser);
  }

  if (error) {
    console.log(error);
    console.log(googleError);
  }

  if (loading) {
    console.log("loading...");
    console.log(googleLoading);
  }

  return (
    <div className="login-container">
      <div className="image-container">
        <img className="image" src={twitterImg} alt="" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
          <h2 className="heading">Happening now!</h2>
          <h3 className="heading1">Join us today!</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="display-name"
              placeholder="@username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              className="display-name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="btn-login">
              <button type="submit" className="btn">
                Sign up
              </button>
            </div>
          </form>
        </div>

        <hr />
        <div className="google-button">
          <GoogleButton
            className="g-btn"
            type="light"
            onClick={handleGoogleSignIn}
          />
        </div>
        <div>
          Already have an account?
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "skyblue",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
