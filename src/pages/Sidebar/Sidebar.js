import React, { useEffect } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
// import ListItemIcon from "@mui/icons-material/ListItem";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import DoneIcon from "@mui/icons-material/Done";
import ListIcon from "@mui/icons-material/List";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SidebarOptions from "./SidebarOptions";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PremiumBadgeIcon from "../PremiumBadgeIcon";
import axios from "axios";
import { BASE_URL } from "../../helper";
import { Link, Navigate } from "react-router-dom";

import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import CustomLink from "./CustomLink";
import "./Sidebar.css";
import useLoggedIn from "../../hooks/useLoggedIn";

const Sidebar = ({ handleLogout, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [loggedInUser] = useLoggedIn();
  //console.log("POP", loggedInUser);
  //console.log("HOLA", user[0]?.displayName);
  const email = user[0]?.email;

  const userProfilePic = loggedInUser[0]?.profileImage
    ? loggedInUser[0]?.profileImage
    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png";

  const handleClick = (e) => {
    // console.log(e.curentTarget);
    setAnchorEl(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const result = user[0]?.email.split("@")[0];
  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar_twitterIcon" />
      <CustomLink to="/home/feed">
        <SidebarOptions active Icon={HomeIcon} text="Home" />
      </CustomLink>
      <CustomLink to="/home/explore">
        <SidebarOptions active Icon={SearchIcon} text="Explore" />
      </CustomLink>
      <CustomLink to="/home/notifications">
        <SidebarOptions active Icon={NotificationsIcon} text="Notifications" />
      </CustomLink>
      <CustomLink to="/home/messages">
        <SidebarOptions active Icon={MailOutlineIcon} text="Messages" />
      </CustomLink>
      <CustomLink to="/home/bookmarks">
        <SidebarOptions active Icon={BookmarkBorderIcon} text="Bookmarks " />
      </CustomLink>
      <CustomLink to="/home/lists">
        <SidebarOptions active Icon={ListAltIcon} text="Lists" />
      </CustomLink>
      <CustomLink to="/home/profile">
        <SidebarOptions active Icon={PermIdentityIcon} text="Profile" />
      </CustomLink>
      <CustomLink to="/home/more">
        <SidebarOptions active Icon={MoreIcon} text="More" />
      </CustomLink>
      <CustomLink to="/home/subscribe">
        <SidebarOptions active Icon={LoyaltyIcon} text="Subscribe" />
      </CustomLink>
      <CustomLink to="/home/premium">
        <SidebarOptions active Icon={WorkspacePremiumIcon} text="Premium+" />
      </CustomLink>
      <Button variant="outlined" className="sidebar_tweet">
        Tweet
      </Button>

      <div className="Profile_info">
        <Avatar src={userProfilePic} />
        <div className="user_info">
          <h4>
            <h4>
              {loggedInUser[0]?.name
                ? loggedInUser[0]?.name
                : user && user[0]?.displayName}
              {loggedInUser[0]?.premiumVerificationApplied === "approved" && (
                <PremiumBadgeIcon />
              )}
            </h4>
          </h4>
          <h5>@{result}</h5>
        </div>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
          onClick={handleClick}
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClick={handleClose}
          onClose={handleClose}
        >
          <MenuItem className="Profile_info1">
            <Avatar src={userProfilePic} />
            <div className="user_info subUser_info">
              <div>
                <h4>
                  <h4>
                    {loggedInUser[0]?.name
                      ? loggedInUser[0]?.name
                      : user && user[0]?.displayName}
                    {loggedInUser[0]?.premiumVerificationApplied ===
                      "approved" && <PremiumBadgeIcon />}
                  </h4>
                </h4>
                <h5>@{result}</h5>
              </div>
              <ListIcon className="done_icon">
                <DoneIcon />
              </ListIcon>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
          <MenuItem onClick={handleLogout}>Log out @mkv09</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;

//user && user[0]?.displayName
