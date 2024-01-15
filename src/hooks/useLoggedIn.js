import { React, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase-init";
import { BASE_URL } from "../helper";
const useLoggedIn = () => {
  const [user] = useAuthState(auth);
  // console.log("HIIIII:", user);
  const email = user?.email;
  // console.log(email);
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/loggedInUser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("ABC:", data);
        setLoggedInUser(data);
      });
  }, [loggedInUser]);
  // console.log("MKV:", loggedInUser);
  return [loggedInUser, setLoggedInUser];
};

export default useLoggedIn;
