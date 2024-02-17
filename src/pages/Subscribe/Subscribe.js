import React from "react";
import { useNavigate } from "react-router-dom";
import "../Page.css";
import "./Subscribe.css";
const Subscribe = () => {
  const navigate = useNavigate();

  const handleSubscribe = (subscriptionType) => {
    console.log(`${subscriptionType} button clicked`);
    navigate(`/payment/${subscriptionType}`);
  };

  return (
    <div className="subscriptionPage">
      <h2>Subscribe to Unlock Premium Features</h2>

      <div className="subscriptionPlans">
        <div className="subscriptionPlan">
          <h3>Silver Plan</h3>
          <p>₹100/month</p>
          <p>5 Tweets/day</p>
          <button onClick={() => handleSubscribe("silver")}>Subscribe</button>
        </div>

        <div className="subscriptionPlan">
          <h3>Gold Plan</h3>
          <p>₹1000/month</p>
          <p>Unlimited Tweets</p>
          <button onClick={() => handleSubscribe("gold")}>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
