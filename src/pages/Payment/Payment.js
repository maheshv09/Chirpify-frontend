import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { stripePublicKey } from "../../helper";
import { BASE_URL } from "../../helper";

const PaymentPage = () => {
  const { subscriptionType } = useParams();
  console.log("PPP", subscriptionType);
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardNumberElement, setCardNumberElement] = useState(null);
  const [expiryDateElement, setExpiryDateElement] = useState(null);
  const [cvcElement, setCvcElement] = useState(null);

  useEffect(() => {
    // Fetch the client secret from the server when the component mounts
    fetch(`${BASE_URL}/getStripeClientSecret/${subscriptionType}`)
      .then((response) => response.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
      });

    // Load Stripe.js asynchronously
    const stripePromise = loadStripe(`${stripePublicKey}`);
    stripePromise.then((stripeInstance) => {
      setStripe(stripeInstance);

      // Create an instance of the card number Element
      const cardNumber = stripeInstance.elements().create("cardNumber");
      cardNumber.mount("#card-number-element");
      setCardNumberElement(cardNumber);

      // Create an instance of the expiry date Element
      const expiryDate = stripeInstance.elements().create("cardExpiry");
      expiryDate.mount("#expiry-date-element");
      setExpiryDateElement(expiryDate);

      // Create an instance of the CVC Element
      const cvc = stripeInstance.elements().create("cardCvc");
      cvc.mount("#cvc-element");
      setCvcElement(cvc);
    });
  }, [subscriptionType]);

  const handlePayment = async () => {
    // Use Stripe.js to handle the card Elements and obtain a PaymentMethod
    const formattedExpiryDate = `${expiryDate.slice(0, 2)}/${expiryDate.slice(
      2
    )}`;

    // Use Stripe.js to handle the card Elements and obtain a PaymentMethod
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        exp_month: parseInt(expiryDate.slice(0, 2), 10),
        exp_year: parseInt(expiryDate.slice(2), 10),
      },
    });
    console.log("Payment Method:", paymentMethod);
    if (error) {
      console.error("Error creating PaymentMethod:", error);
      return;
    }

    // Confirm the PaymentIntent with the server using the PaymentMethod and client secret
    const { paymentIntent, confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethod.id,
      }
    );

    if (confirmError) {
      console.error("Error confirming payment:", confirmError);
      return;
    }

    console.log("Payment confirmed:", paymentIntent);
    // Rest of the code...
  };

  return (
    <>
      <div id="card-number-element"></div>
      <div id="expiry-date-element"></div>
      <div id="cvc-element"></div>
      <button onClick={handlePayment}>Make Payment</button>
    </>
  );
};

export default PaymentPage;
