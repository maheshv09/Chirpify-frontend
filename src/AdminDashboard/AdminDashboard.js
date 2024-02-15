import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { BASE_URL } from "../helper";
import { toast } from "react-toastify";
const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/premiumVerificationRequests`
      );
      setRequests(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching premium verification requests:", error);
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (email) => {
    try {
      await axios.put(
        `${BASE_URL}/admin/approvePremiumVerificationRequest/${email}`
      );
      toast.success("Premium verification request approved successfully!");
      fetchRequests();
    } catch (error) {
      console.error("Error approving premium verification request:", error);
      alert("Error approving premium verification request");
    }
  };

  const handleRejectRequest = async (email) => {
    try {
      await axios.put(
        `${BASE_URL}/admin/rejectPremiumVerificationRequest/${email}`
      );
      toast.success("Premium verification request rejected successfully!");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting premium verification request:", error);
      alert("Error rejecting premium verification request");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {requests.length === 0 ? (
            <p>No premium verification requests found.</p>
          ) : (
            <ul className="requests-list">
              {requests.map((request) => (
                <li key={request._id} className="request-item">
                  <div>Name: {request.name}</div>
                  <div>Email: {request.email}</div>
                  <div>Reason: {request.reason}</div>
                  <div>
                    Social Media Profiles: {request.socialMediaProfiles}
                  </div>
                  <div>
                    Identity Proof Photo:{" "}
                    <img src={request.identityDocument} alt="Identity Proof" />
                  </div>
                  <div>
                    <button onClick={() => handleApproveRequest(request.email)}>
                      Approve
                    </button>
                    <button onClick={() => handleRejectRequest(request.email)}>
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
