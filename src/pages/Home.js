import React from "react";
import Sidebar from "./Sidebar/Sidebar.js";
import Feed from "./Feed/Feed.js";
import Widgets from "./Widgets/Widgets.js";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase-init.js";
import { signOut } from "firebase/auth";
import { Outlet } from "react-router-dom";
const Home = () => {
  const user = useAuthState(auth);
  console.log(user[0].email);
  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <div className="app">
      <Sidebar handleLogout={handleLogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
