import React, { useState } from "react";
import twitterImg from "../../assets/images/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../firebase-init";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { setLoginAttempts } from "../../firebase-init";
import { getDatabase, ref, get, set } from "firebase/database";
import { BASE_URL } from "../../helper";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const blockAccount = async (email1) => {
    const usersRef = ref(getDatabase(), `users/${email1}`);

    const blockedUntil = new Date();
    blockedUntil.setHours(blockedUntil.getHours() + 1);

    await set(usersRef, { blockedUntil: blockedUntil.getTime() });
  };

  const isAccountBlocked = (userSnapshot) => {
    const blockedUntil = userSnapshot.val()?.blockedUntil || 0;
    return Date.now() < blockedUntil;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user;
    try {
      const email1 = email.split("@")[0];
      const usersRef = ref(getDatabase(), `users/${email1}`);
      const userSnapshot = await get(usersRef);

      if (!userSnapshot.exists()) {
        toast.error("User with given email doesn't exist");
        return;
      }

      if (isAccountBlocked(userSnapshot)) {
        toast.error("Account is blocked. Please try again later.");

        return;
      }
      const userCredential = await signInWithEmailAndPassword(email, password);
      user = userCredential.user;
      const userId = user.userId;

      console.log("Login successful");

      setLoginAttempts(userId, 0);
    } catch (error) {
      console.error("Error signing in:", error.message);

      const email1 = email.split("@")[0];

      const usersRef = ref(getDatabase(), `users/${email1}`);
      const userSnapshot = await get(usersRef);

      if (!userSnapshot.exists()) {
        toast.error("User with given email doesn't exist");
      } else {
        const attemptsRef = ref(getDatabase(), `loginAttempts/${email1}`);
        const snapshot = await get(attemptsRef);
        const currentAttempts = snapshot.val();
        toast.warn("Incorrect password!");
        console.log("OP", currentAttempts);

        const newAttempts = currentAttempts + 1;
        console.log("NOP", newAttempts);
        setLoginAttempts(email1, newAttempts);

        if (newAttempts >= 3 && newAttempts % 3 === 0) {
          try {
            const response = await axios.post(`${BASE_URL}/sendEmail`, {
              to: email,
              subject: "Login Warning",
              text: "Your account has reached 3 failed login attempts.",
            });
            console.log(response.data.message);
          } catch (error) {
            console.error("Error sending email:", error);
          }
          toast.warn("Your account has reached 3 failed login attempts.");
          console.log("Failed login attempts: 3");
        }

        if (newAttempts >= 5) {
          console.log("Failed login attempts: 5");
          await blockAccount(email1);
          try {
            const response = await axios.post(`${BASE_URL}/sendEmail`, {
              to: email,
              subject: "Account Blocked",
              text: "Your account has been blocked due to 5 failed login attempts. Please contact support to unblock.",
            });
            toast.error(
              "Your account has been blocked due to 5 failed login attempts. Try logging in after 1 hour!"
            );
            console.log(response.data.message);
          } catch (error) {
            console.error("Error sending email:", error);
          }

          setLoginAttempts(email1, 0);
        }
      }
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
  const handleAdminLogin = () => {
    navigate("/admin-login");
  };
  return (
    <div className="login-container">
      <ToastContainer />
      <div className="image-container">
        <img className="image" src={twitterImg} alt="" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon style={{ color: "skyblue" }} />
          <h2 className="heading">Happening now!</h2>
          <h3 className="heading1">Join us today!</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="btn-login">
              <button type="submit" className="btn">
                Login
              </button>
            </div>
          </form>
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAdminLogin}
          fullWidth
        >
          Admin Portal
        </Button>
        <hr />
        <div className="google-button">
          <GoogleButton
            className="g-btn"
            type="light"
            onClick={handleGoogleSignIn}
          />
        </div>
        <div>
          Don't have an account?
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "skyblue",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
