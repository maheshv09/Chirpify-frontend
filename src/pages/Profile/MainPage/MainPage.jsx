import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import useLoggedIn from "../../../hooks/useLoggedIn";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "axios";
import Post from "../../Feed/Post/Post";
import EditProfile from "../EditProfile/EditProfile";
import { BASE_URL } from "../../../helper";
import PremiumBadgeIcon from "../../PremiumBadgeIcon";
const MainPage = ({ user }) => {
  const navigate = useNavigate();
  const username = user?.email?.split("@")[0];
  const [loggedInUser] = useLoggedIn();
  //console.log("KLM", loggedInUser);
  //const [imageURL, setImageURL] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [allowedTweets, setAllowedTweets] = useState("");

  const [todaysTweets, setTodaysTweets] = useState(0);
  const [dispSubscr, setDispSubscr] = useState(0);
  useEffect(() => {
    const subscriptionType = loggedInUser[0]?.subscriptionType;
    subscriptionType
      ? setDispSubscr(subscriptionType)
      : setDispSubscr("Free plan");
    setAllowedTweets(loggedInUser[0]?.allowedTweets);
    if (allowedTweets == 99999) {
      setAllowedTweets("Unlimited");
    }
    setTodaysTweets(loggedInUser[0]?.todaysTweets);
    fetch(`${BASE_URL}/userPost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [posts, user?.email]);

  const handleUploadCoverImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    //console.log("ZXC", formData);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=e260abee406449ae9e7c159665ef502c",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userCoverImage = {
          email: user?.email,
          coverImage: url,
        };
        //setImageURL(url);
        //console.log("Hello", res);
        setIsLoading(false);
        if (url) {
          axios.patch(`${BASE_URL}/userUpdates/${user?.email}`, userCoverImage);
        }
      });
  };
  const handleUploadProfileImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    console.log("ZXC", formData);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=e260abee406449ae9e7c159665ef502c",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userProfileImage = {
          email: user?.email,
          profileImage: url,
        };
        //setImageURL(url);
        //console.log("Hello", res);
        setIsLoading(false);
        if (url) {
          axios.patch(
            `${BASE_URL}/userUpdates/${user?.email}`,
            userProfileImage
          );
        }
      });
  };

  //   console.log("PPP", loggeInUser);
  return (
    <div>
      <ArrowBackIcon
        className="arrow-icon"
        onClick={() => {
          navigate("/");
        }}
      />
      <h4 className="heading-4">@{username}</h4>
      <div className="mainProfile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  src={
                    loggedInUser[0]?.coverImage
                      ? loggedInUser[0]?.coverImage
                      : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                  }
                  alt=""
                  className="coverImage"
                />
                <div className="hoverCoverImage">
                  <label htmlFor="image" className="imageIcon">
                    {isLoading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>

                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleUploadCoverImage}
                  />
                </div>
              </div>
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    src={
                      loggedInUser[0]?.profileImage
                        ? loggedInUser[0]?.profileImage
                        : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png"
                    }
                    alt=""
                    className="avatar"
                  />
                  <div className="hoverAvatarImage">
                    <div className="imageIcon_tweetButton">
                      <label htmlFor="profileImage" className="imageIcon">
                        {isLoading ? (
                          <LockResetIcon className="photoIcon photoIconDisabled" />
                        ) : (
                          <CenterFocusWeakIcon className="photoIcon" />
                        )}
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        className="imageInput"
                        onChange={handleUploadProfileImage}
                      />
                    </div>
                  </div>
                </div>
                <div className="userInfo">
                  <div>
                    <h3 className="heading-3">
                      {loggedInUser[0]?.name
                        ? loggedInUser[0]?.name
                        : user && user?.displayName}
                      {loggedInUser[0]?.premiumVerificationApplied ===
                        "approved" && <PremiumBadgeIcon />}
                    </h3>
                    <p className="usernameSection">@{username}</p>
                    <h4>Subscribed Plan : {dispSubscr}</h4>
                    <p>Allowed Tweets : {allowedTweets}</p>
                    <p>Todays Tweets : {todaysTweets}</p>
                  </div>
                  <EditProfile user={user} loggedInUser={loggedInUser} />
                </div>
                <div className="infoContainer">
                  {loggedInUser[0]?.bio ? loggedInUser[0]?.bio : ""}
                  <div className="locationAndLink">
                    {loggedInUser[0]?.location ? (
                      <p className="subInfo">
                        <MyLocationIcon />
                        {loggedInUser[0]?.location}
                      </p>
                    ) : (
                      ""
                    )}
                    {loggedInUser[0]?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon />
                        {loggedInUser[0]?.website}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <h4 className="tweetsText">Tweets</h4>
                  <hr />
                </div>
                {posts.map((p) => (
                  <Post id={p._id} p={p} />
                ))}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MainPage;
