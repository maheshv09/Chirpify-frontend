import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../helper";
import { useNavigate } from "react-router-dom";
import useLoggedIn from "../../hooks/useLoggedIn";
import "./Premium.css";
import PageLoading from "../PageLoading";

const Premium = () => {
  const [reason, setReason] = useState("");
  const [socialMediaProfiles, setSocialMediaProfiles] = useState("");
  const [identityDocument, setIdentityDocument] = useState(null);
  const [isLoading, setIsLoading] = useState("");
  const navigate = useNavigate();
  const [loggedInUser] = useLoggedIn();
  const email = loggedInUser[0]?.email;
  const name = loggedInUser[0]?.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", identityDocument); // Append only the image file

      // Upload the image file
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=063526088627f6e6262606d676b60f2e",
        formData
      );

      const imageUrl = res.data.data.display_url;
      console.log("urll", imageUrl);
      // Now you can use imageUrl to submit the application with the image URL

      const applicationData = {
        name,
        email,
        reason,
        socialMediaProfiles,
        identityDocument: imageUrl, // Use the image URL instead of the file
      };

      // Submit the premium badge application with the image URL
      await axios.post(`${BASE_URL}/applyForPremiumBadge`, applicationData);
      setIsLoading(false);
      console.log("Application submitted successfully");
      navigate("/premPay");
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <PageLoading />
      ) : (
        <form className="premiumForm" onSubmit={handleSubmit}>
          <div className="formInput">
            <label htmlFor="reason">Reason for Verification</label>
            <TextField
              id="reason"
              variant="outlined"
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              required
            />
          </div>
          <div className="formInput">
            <label htmlFor="socialMediaProfiles">Social Media Profiles</label>
            <TextField
              id="socialMediaProfiles"
              variant="outlined"
              multiline
              rows={2}
              value={socialMediaProfiles}
              onChange={(e) => setSocialMediaProfiles(e.target.value)}
              fullWidth
            />
          </div>
          <div className="formInput">
            <label>
              Submit an identity proof for verification (Aadhar/Pan/VoterId in
              jpeg form)
            </label>
            <input
              type="file"
              id="identityDocument"
              className="fileSel"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setIdentityDocument(e.target.files[0])}
              required
            />
            <label className="fileInputLabel" htmlFor="identityDocument">
              <span>Choose File</span>
            </label>
          </div>
          <Button variant="contained" type="submit">
            Submit Application
          </Button>
        </form>
      )}
    </>
  );
};

export default Premium;
