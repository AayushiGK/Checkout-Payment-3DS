# Checkout.com 3D Secure (3DS) Payment Integration

## Overview
This project implements a **3D Secure (3DS) payment flow** using **Checkout.com** APIs. It consists of a **backend (`server.js`)** that interacts with Checkout.com to create and retrieve payment sessions, and a **frontend (`App.jsx`)** that handles user interactions, processes payments, and listens for 3DS authentication events. A **dummy 3DS page (`dummy-3ds.html`)** is used to simulate the challenge process.

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

## **1️⃣ Backend: `server.js`**
### **Description**
- Acts as a backend server to interact with **Checkout.com API**.
- Handles **payment session creation**
- Requires a **Checkout.com Secret Key (`sk_sbox_xxx`)**.

### **APIs in `server.js`**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/post-payment-sessions` | Creates a new payment session via Checkout.com |

### **Environment Variables Required**
```env
SECRET_KEY=sk_sbox_xxxxxxxxxxxxxxxx  # Your Checkout.com Secret Key
PROCESSING_CHANNEL_ID=pc_********    # Your Checkout.com processing channel ID
```

### **How It Works**
1. The frontend calls `POST /post-payment-sessions` to generate a **payment session ID**.
2. The backend forwards the request to Checkout.com and returns the response.
3. If **3D Secure is required**, a **redirect URL** is returned.
4. The frontend opens the 3DS challenge via a pop-up or redirection.

---

## **2️⃣ Frontend: `App.jsx`**
### **Description**
- Handles **payment initialization** and **3D Secure authentication**.
- Listens for 3DS challenge success or failure.
- Uses **Checkout.com Web Components** to process payments.

### **How It Works**
1. Loads the **Checkout.com Web Components** script.
2. Calls `/post-payment-sessions` to create a payment session.
3. Checks if a **3DS challenge** is required.
4. If needed, opens a pop-up for authentication.
5. Waits for success or failure response from `dummy-3ds.html`.
6. Updates UI with payment status.

### **Key Functionality in `App.jsx`**
| Feature | Description |
|---------|-------------|
| `handlePayment()` | Triggers payment and handles 3DS redirect |

---

## **3️⃣ Dummy 3DS Page: `dummy-3ds.html`**
### **Description**
- Simulates a **3D Secure challenge page**.
- Accepts success or failure and forwards the result back to the frontend.

### **How It Works**
1. The frontend opens `dummy-3ds.html` in a new window.
2. The page simulates user authentication and sends the result to the frontend.
3. The frontend updates the UI based on the 3DS result.

---

## **🔧 Setup & Running the Project**

### **📌 1. Install Dependencies & Run Frontend**
```sh
npm install
npm start dev
```

### **📌 2. Start the Backend**
```sh
node server.js
```

### **📌 3. Trigger a Payment Flow**
- Open the frontend and click **"Pay with 3D Secure"**.
- If 3DS is required, a pop-up will appear.
- Complete the 3DS authentication.
- The UI updates with **Success / Failure**.

---

## **📌 Expected API Response (For Debugging)**

POST :  "https://api.sandbox.checkout.com/payment-sessions"
Header : {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
        }
Body : {
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
        }
### **✅ Successful Payment Session Response**
```json
{
  "id": "ps_2tuKaWKgwKWz8gkVG5Tfq5xe4In",
  "payment_session_secret": "pss_5376b99f-c1b8-4262-acd4-8cdcf05fa9e3",
  "status": "Pending",
  "next_action": {
    "type": "redirect",
    "redirect_url": "https://sandbox.checkout.com/3ds/challenge?session_id=ps_2tuKaWKgwKWz8gkVG5Tfq5xe4In"
  }
}
```

---

## **🎯 Next Steps**
- [ ] Ensure Checkout.com **3D Secure is enabled** for your test account.
- [ ] Check if `next_action.redirect_url` is returned in API response.
- [ ] If missing, contact **Checkout.com Support** to enable 3DS for your sandbox account.

Let me know if you need further enhancements! 🚀

