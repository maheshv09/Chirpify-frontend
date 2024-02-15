import { useEffect, useState } from "react";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "../../helper";
import { useParams } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Form from "./Form";
import { stripePublicKey } from "../../helper";

const stripePromise = loadStripe(`${stripePublicKey}`);

const Payment1 = () => {
  const { subscriptionType } = useParams();
  console.log("ZZZ", subscriptionType);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/getStripeClientSecret/${subscriptionType}`)
      .then((response) => response.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
      });
  }, [subscriptionType]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <Form clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

export default Payment1;
