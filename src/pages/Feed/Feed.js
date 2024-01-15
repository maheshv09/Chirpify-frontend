import React, { useEffect, useState } from "react";
import TweetBox from "../TweetBox/TweetBox";
import "./Feed.css";
import "../Page.css";
import Post from "./Post/Post";
import axios from "axios";
import { BASE_URL } from "../../helper";
const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/getPosts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [posts]);
  return (
    <div className="feedContainer">
      <h2>Home</h2>
      <TweetBox />
      {posts.map((p) => (
        <Post key={p._id} p={p} />
      ))}
      {/* <div className="page">
        <h2 className="pageTitle">Welcome to Explore!</h2>
      </div> */}
    </div>
  );
};

export default Feed;
