// ProtectedAdminRoute.js
import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase-init";
import PageLoading from "./PageLoading";

const ProtectedAdminRoute = ({ children }) => {
  const [user, isLoading] = useAuthState(auth);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!user || user.email !== "admin@gmail.com") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedAdminRoute;
