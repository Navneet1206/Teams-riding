# Teams Riding

This is a testing website, not for real-life application.

## Backend Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FRONTEND_URL=http://localhost:5173
```

## Frontend Environment Variables

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOMAPPRO_API_KEY=your_gomappro_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## How to Run

### Frontend

1. Install dependencies:
    ```sh
    npm install
    ```

2. Start the development server:

    ```sh
    npm run dev
    ```

### Backend

1. Navigate to the server directory:

    ```sh
    cd server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server:

    ```sh
    npm run server
    ```