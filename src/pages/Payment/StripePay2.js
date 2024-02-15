import StripeCheckout from "react-stripe-checkout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { stripePublicKey } from "../../helper";
import { useAuthState } from "react-firebase-hooks/auth";
import { BASE_URL } from "../../helper";
import axios from "axios";
import auth from "../../firebase-init";
import "./StripePay2.css";

const StripePay2 = () => {
  const user = useAuthState(auth);
  const userEmail = user[0]?.email;
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const onToken = (token) => {
    console.log("Payment Token:", token);
    setPaymentCompleted(true);
  };

  const amount = 1000; // Fee for premium verification application

  // Redirect to home if payment is completed
  if (paymentCompleted) {
    navigate("/home");
    // Update user's profile to reflect premium verification application
    axios
      .patch(`${BASE_URL}/userUpdates/${userEmail}`, {
        premiumVerificationApplied: "pending",
      })
      .then((response) => {
        console.log("Premium verification application updated:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error updating premium verification application:",
          error
        );
      });
  }

  return (
    <div className="paymentContainer">
      <h2>Premium Verification Application Fee</h2>
      <p>Amount: {amount} INR</p>

      <StripeCheckout
        name="Premium Verification Application"
        currency="INR"
        amount={amount * 100}
        token={onToken}
        stripeKey={stripePublicKey}
      >
        <button className="stripeCheckoutButton">Pay Now</button>
      </StripeCheckout>
    </div>
  );
};

export default StripePay2;
