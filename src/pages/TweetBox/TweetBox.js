import React, { useState } from "react";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import axios from "axios";
import "./TweetBox.css";
import useLoggedIn from "../../hooks/useLoggedIn";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase-init";
import { BASE_URL } from "../../helper";
const TweetBox = () => {
  const [post, setPost] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const user = useAuthState(auth);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const email = user[0]?.email;

  const [loggedInUser] = useLoggedIn();
  const userProfilePic = loggedInUser[0]?.profileImage
    ? loggedInUser[0]?.profileImage
    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png";
  const handleUploadImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=e260abee406449ae9e7c159665ef502c",
        formData
      )
      .then((res) => {
        setImageURL(res.data.data.display_url);
        //console.log("Hello", res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("EROR", error);
        setIsLoading(false);
      });
  };

  const handleTweet = (e) => {
    e.preventDefault();
    if (user[0].providerData[0].providerId === "password") {
      fetch(`${BASE_URL}/loggedInUser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("OOP:", data);
          setName(data[0]?.name);
          setUserName(data[0]?.username);
        });
    } else {
      setName(user[0]?.displayName);
      setUserName(email?.spilt("@")[0]);
    }
    console.log("HUU:", name);
    if (name) {
      const userPost = {
        profilePhoto: userProfilePic,
        post: post,
        photo: imageURL,
        username: username,
        name: name,
        email: email,
      };
      setPost("");
      setImageURL("");
      //console.log(userPost);
      fetch(`${BASE_URL}/post`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userPost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  };
  return (
    <div className="tweetBox">
      <form onSubmit={handleTweet}>
        <div className="tweetBox__input">
          <Avatar src={userProfilePic} />
          <input
            type="text"
            placeholder="What's happening"
            onChange={(e) => setPost(e.target.value)}
            value={post}
            required
          />
        </div>
        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {/* <AddPhotoAlternateIcon /> */}
            {isLoading ? (
              <p>Uploading Image</p>
            ) : (
              <p>{imageURL ? "image uploaded" : <AddPhotoAlternateIcon />}</p>
            )}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleUploadImage}
          />
          <Button className="tweetBox__tweetButton" type="submit">
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetBox;
