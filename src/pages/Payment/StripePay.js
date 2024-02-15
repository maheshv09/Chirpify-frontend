import StripeCheckout from "react-stripe-checkout";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stripePublicKey } from "../../helper";
import { useAuthState } from "react-firebase-hooks/auth";
import { BASE_URL } from "../../helper";
import axios from "axios";
import auth from "../../firebase-init";
import "./StripePay.css";

const StripePay = () => {
  const { subscriptionType } = useParams();
  const user = useAuthState(auth);
  const userEmail = user[0]?.email;
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const onToken = (token) => {
    console.log("Payment Token:", token);
    setPaymentCompleted(true);
  };

  const amount = subscriptionType === "silver" ? 100 : 1000;
  const allowedTweets = subscriptionType === "silver" ? 5 : 99999;
  // Redirect to home/feed if payment is completed
  if (paymentCompleted) {
    navigate("/home");
    axios
      .patch(`${BASE_URL}/userUpdates/${userEmail}`, {
        subscriptionType: subscriptionType,
        allowedTweets: allowedTweets,
      })
      .then((response) => {
        console.log("Subscription updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
      });
  }

  return (
    <div className="paymentPage">
      <h2>Subscription Payment</h2>
      <div className="paymentDetails">
        <p>Subscription Type: {subscriptionType}</p>
        <p>Amount: {amount} INR</p>
      </div>

      <StripeCheckout
        name={`${subscriptionType} subscription`}
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

export default StripePay;
