import React, { useState, useEffect } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const postPaymentSession = await fetch(
          "http://localhost:3001/post-payment-sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await postPaymentSession.json();

        if (!data || !data.next_action || !data.next_action.redirect_url) {
          throw new Error("Invalid payment session response");
        }

        // Store redirect URL for later use
        setRedirectUrl(data.next_action.redirect_url);
        setMessage("Payment session created. Click below to authenticate.");
      } catch (error) {
        console.error("Error initializing payment:", error);
        setMessage("Failed to initialize payment");
      }
    };

    initializeCheckout();

    // Listen for messages from 3DS popup
    const handleMessage = (event) => {
      if (event.data && event.data.status) {
        setMessage(
          event.data.status === "succeeded"
            ? "Payment successful!"
            : "Payment failed. Try again."
        );
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const open3DS = () => {
    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "width=500,height=600");
    } else {
      setMessage("No authentication link available.");
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "block",
        justifyItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h1>3D Secure Payment</h1>
      {message && <p>{message}</p>}
      {redirectUrl && <button onClick={open3DS}>Proceed to 3D Secure</button>}
    </div>
  );
};

export default App;
