import React, { useState } from "react";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import axios from "axios";
import "./TweetBox.css";
import useLoggedIn from "../../hooks/useLoggedIn";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase-init";
import { BASE_URL } from "../../helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TweetBox = ({ subscriptionType }) => {
  const [post, setPost] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const user = useAuthState(auth);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const email = user[0]?.email;
  //console.log("BBB", email);
  const [loggedInUser] = useLoggedIn();
  const userProfilePic = loggedInUser[0]?.profileImage
    ? loggedInUser[0]?.profileImage
    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png";
  //console.log("MMMM", user);
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

  const handleTweet = async (e) => {
    e.preventDefault();
    let tweetLimit = 1;
    if (subscriptionType === "silver") {
      tweetLimit = 5;
    } else if (subscriptionType === "gold") {
      tweetLimit = 99999;
    }

    const todaysTweets = loggedInUser[0]?.todaysTweets || 0;

    if (todaysTweets >= tweetLimit) {
      toast.error("Tweet limit reached for today. Try tweeting tomorrow!");
      return;
    }
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
      setUserName(email?.split("@")[0]);
    }
    //console.log("HUU:", name);
    const premiumAcc =
      loggedInUser[0]?.premiumVerificationApplied === "approved"
        ? loggedInUser[0]?.premiumVerificationApplied
        : "No";
    if (name) {
      const userPost = {
        profilePhoto: userProfilePic,
        post: post,
        photo: imageURL,
        username: username,
        name: name,
        email: email,
        premiumAcc: premiumAcc,
      };
      //console.log("LLL", userPost);
      try {
        const response = await axios.post(`${BASE_URL}/post`, userPost);
        toast.success("Tweet posted successfully");

        await axios.patch(`${BASE_URL}/userUpdates/${email}`, {
          todaysTweets: todaysTweets + 1,
        });

        setPost("");
        setImageURL("");
      } catch (error) {
        console.error("Error posting tweet:", error);
        toast.error("Error posting tweet");
      }
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
