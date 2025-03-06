import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.options("*", cors());

const {SECRET_KEY, PROCESSING_CHANNEL_ID} = process.env // Replace with your actual secret key



// Serve static files (for 3DS HTML)
app.use(express.static(path.join(__dirname, "public")));

app.post("/post-payment-sessions", async (_req, res) => {
  try {
    const response = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: 6540,
          currency: "GBP",
          reference: "ORD-123A",
          description: "Payment for Guitars and Amps",
          processing_channel_id: PROCESSING_CHANNEL_ID,
          "3ds": {
            enabled: true,
            attempt_n3d: true,
          },
          success_url: "http://localhost:5173/?status=succeeded",
          failure_url: "http://localhost:5173/?status=failed",
          billing: {
            address: {
              address_line1: "123 High St.",
              country: "GB",
            },
          },
          customer: {
            name: "Jia Tsang",
            email: "jia.tsang@example.com",
          },
        }),
      }
    );
    const data = await response.json();

    const mockDataAdded = {
      ...data,
      status: "Pending",
      next_action: {
        type: "redirect",
        redirect_url: `http://localhost:3001/dummy-3ds?redirect_url=http://localhost:5173/`,
      },
    };

    console.log("Payment Session Response:", mockDataAdded);

    if (!response.ok) {
      throw new Error(`API Error: ${JSON.stringify(mockDataAdded)}`);
    }

    res.status(response.status).json(mockDataAdded);
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve Dummy 3DS Page
app.get("/dummy-3ds", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "dummy-3ds.html"));
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
