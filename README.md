# Checkout.com 3D Secure (3DS) Payment Integration

## Overview
This project implements a **3D Secure (3DS) payment flow** using **Checkout.com** APIs. It consists of a **backend (`server.js`)** that interacts with Checkout.com to create and retrieve payment sessions, and a **frontend (`App.jsx`)** that handles user interactions, processes payments, and listens for 3DS authentication events. A **dummy 3DS page (`dummy-3ds.html`)** is used to simulate the challenge process.

## Create Checkout Account for API Keys.
- Visit [checkout.com](https://www.checkout.com/)
- Click **Sign In** on the top right corner.
- Start with the Test environment.
- Once you are logged in Do to developer tools from the top right icons presented on the screen. **Developer Tools icon </>**
- In the key Section Create A secret Key With 2 parameters Required. (Can also opt for all at onces not issues with that.)
  1. Payment-session
  2. Vault:Tokenization
- Keep the Key save as its not visible again due to Security reasons. Also Not the Processing Channel ID. 

---

## Project Structure

```
checkout-3ds-payment/
│── backend/
│   ├── server.js      # Express backend to handle API requests to Checkout.com
│
│── frontend/
│   ├── App.jsx        # React frontend to initiate payments and handle 3DS authentication
|
|-- Public
│   ├── dummy-3ds.html # Simulated 3DS authentication page
│
│── README.md          # Documentation
```

---

### **1️⃣ Backend: `server.js`**
**Description**
- Acts as a backend server to interact with **Checkout.com API**.
- Handles **payment session creation**
- Requires a **Checkout.com Secret Key (`sk_sbox_xxx`)**.

**APIs in `server.js`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/post-payment-sessions` | Creates a new payment session via Checkout.com |

**Environment Variables Required**
```env
SECRET_KEY=sk_sbox_xxxxxxxxxxxxxxxx  # Your Checkout.com Secret Key
PROCESSING_CHANNEL_ID=pc_********    # Your Checkout.com processing channel ID
```
**How It Works**
1. The frontend calls `POST /post-payment-sessions` to generate a **payment session ID**.
2. The backend forwards the request to Checkout.com and returns the response.
3. If **3D Secure is required**, a **redirect URL** is returned.
4. The frontend opens the 3DS challenge via a pop-up or redirection.

---

### **2️⃣ Frontend: `App.jsx`**
**Description**
- Handles **payment initialization** and **3D Secure authentication**.
- Listens for 3DS challenge success or failure.
- Uses **Checkout.com Web Components** to process payments.

**How It Works**
1. Loads the **Checkout.com Web Components** script.
2. Calls `/post-payment-sessions` to create a payment session.
3. Checks if a **3DS challenge** is required.
4. If needed, opens a pop-up for authentication.
5. Waits for success or failure response from `dummy-3ds.html`.
6. Updates UI with payment status.

**Key Functionality in `App.jsx`**
| Feature | Description |
|---------|-------------|
| `handlePayment()` | Triggers payment and handles 3DS redirect |

---

### **3️⃣ Dummy 3DS Page: `dummy-3ds.html`**
**Description**
- Simulates a **3D Secure challenge page**.
- Accepts success or failure and forwards the result back to the frontend.

**How It Works**
1. The frontend opens `dummy-3ds.html` in a new window.
2. The page simulates user authentication and sends the result to the frontend.
3. The frontend updates the UI based on the 3DS result.

---

### **🔧 Setup & Running the Project**

**📌 1. Install Dependencies & Run Frontend**
```sh
npm install
npm start dev
```

**📌 2. Start the Backend**
```sh
node server.js
```

**📌 3. Trigger a Payment Flow**
- Open the frontend and click **"Pay with 3D Secure"**.
- If 3DS is required, a pop-up will appear.
- Complete the 3DS authentication.
- The UI updates with **Success / Failure**.

---


### **API Request & Response**

**Method** POST:"https://api.sandbox.checkout.com/payment-sessions"

**Header** 
```json
{
  Authorization: `Bearer ${SECRET_KEY}`,
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
}
```

**Body** 
```json
{
  amount: 600,
  currency: "INR",
  reference: "ORD-123A",
  description: "Payment for Amps",
  processing_channel_id: PROCESSING_CHANNEL_ID,
  "3ds": {
    enabled: true,
    attempt_n3d: true,
  },
  success_url: "http://localhost:5173/?status=succeeded",
  failure_url: "http://localhost:5173/?status=failed",
  billing: {
    address: {
    address_line1: "--------",
    country: "INR",
    },
  },
  customer: {
    name: "ABC Xyz",
    email: "abc.xyz@example.com",
  },
}
```
**Successful Payment Session Response**
```json
{
  "id": "ps_2tu----------",
  "payment_session_secret": "pss_5376b99----------",
  "status": "Pending",
  "next_action": {
    "type": "redirect",
    "redirect_url": "https://sandbox.checkout.com/3ds/challenge?session_id=ps_2tu-----------"
  }
}
```

---

### **Next Steps**
- [ ] Ensure Checkout.com **3D Secure is enabled** for your test account.
- [ ] Check if `next_action.redirect_url` is returned in API response.
- [ ] If missing, contact **Checkout.com Support** to enable 3DS for your sandbox account.

Let me know if you need further enhancements! 🚀

