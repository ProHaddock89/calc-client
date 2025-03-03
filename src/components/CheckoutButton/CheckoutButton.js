import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your_public_stripe_key");

const CheckoutButton = ({ product }) => {
  const handleCheckout = async () => {
    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return <button onClick={handleCheckout}>Buy Now</button>;
};

export default CheckoutButton;
