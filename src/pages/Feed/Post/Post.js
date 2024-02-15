import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import "./Post.css";
//import useLoggedIn from "../../../hooks/useLoggedIn";
import PremiumBadgeIcon from "../../PremiumBadgeIcon";
import axios from "axios";
import { BASE_URL } from "../../../helper";

const Post = ({ p }) => {
  //console.log(p);
  const { name, email, username, photo, post, profilePhoto } = p;
  const [premAcc, setPremAcc] = useState("");
  useEffect(() => {
    console.log("ZYT", email);
    //const [loggedInUser] = useLoggedIn();
    //const [verifPosts, setVerifPosts] = useState(null);
    if (email) {
      const resp = axios.get(`${BASE_URL}/isVerified/${email}`);
      resp
        .then((response) => {
          console.log("RESPONSEE", response.data.success);
          if (response.data.success) {
            console.log("NNN", response.data.success);
            setPremAcc(response.data.success);
            console.log("MKK", premAcc);
          }
        })
        .catch((error) => {
          // console.log("Error", error);
        });
    }
  }, [name, email, username, photo, post, profilePhoto, premAcc]);

  return (
    <div className="post">
      <div>
        <div className="post_avatar">
          <Avatar src={profilePhoto} />
        </div>
      </div>

      <div className="post_body">
        <div className="post_header">
          <div className="post_headerText">
            <h3>
              {name}
              {""}
              {premAcc ? (
                <span className="post_headerSpecial">
                  <PremiumBadgeIcon />@{username}
                </span>
              ) : (
                <span className="post_headerSpecial">
                  <VerifiedIcon className="post_badge" />@{username}
                </span>
              )}
            </h3>
          </div>
          <div className="post_headerDescription">
            <p>{post}</p>
          </div>
          <img className="postImg" src={photo} alt="" width="500" />
          <div className="post_footer">
            <ChatBubbleOutlineIcon
              className="post_footer_icon"
              fontSize="small"
            />
            <RepeatIcon className="post_footer_icon" fontSize="small" />
            <FavoriteBorderIcon className="post_footer_icon" fontSize="small" />
            <PublishIcon className="post_footer_icon" fontSize="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
