import { useEffect, useState } from "react";
import React from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { BASE_URL } from "../../helper";
// import { useParams } from "react-router-dom";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { BASE_URL } from "../../helper";

// import { stripePublicKey } from "../../helper";

const Form = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then((paymentIntent) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment Succeeded!");
          console.log(message);
          break;
        case "processing":
          setMessage("Payment processing!");
          console.log(message);
          break;
        case "requires_payment_method":
          setMessage("Payment not successful, try again!");
          console.log(message);
          break;
        default:
          setMessage("Something went wrong.");
          console.log(message, paymentIntent.status);
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${BASE_URL}/success`,
      },
    });
    console.log("MM", error);
    if (
      error &&
      (error.type === "card_error" || error.type === "validation_error")
    ) {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred!");
    }
    setIsLoading(false);
  };
  const handleEmail = (e) => {
    console.log(e);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={handleEmail}
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default Form;
