
# Advanced Login System - MERN Stack

This project is an **Advanced Login System** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It includes robust authentication features such as sign up, login, password reset via email, OTP-based email confirmation, and a welcome email feature. Tailwind CSS is used for clean, responsive styling.

## Features

✅ User Sign Up  
✅ User Login  
✅ Password Reset via Email  
✅ Email Confirmation with 6-digit OTP  
✅ Welcome Email after Successful Registration  
✅ Tailwind CSS for UI Styling  
✅ Secure Authentication and Error Handling  

## Technologies Used

- **MongoDB** – NoSQL database
- **Express.js** – Backend web framework
- **React.js** – Frontend JavaScript library
- **Node.js** – Server environment
- **Tailwind CSS** – For styling the frontend
- **Mailtrap** – For testing email features

## How it Works

### 🔐 Authentication Flow
1. **Sign Up**: User signs up with email and password.
2. **Email Confirmation**: A 6-digit OTP is sent to the user's email to confirm the address.
3. **Welcome Email**: Once confirmed, a welcome email is sent.
4. **Login**: User logs in with email and password.
5. **Password Reset**: If the password is forgotten, a reset email is sent with instructions.

### 📩 Email Handling
All emails (OTP, password reset, welcome) are handled using **Mailtrap** to simulate real email delivery in development.

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)
- Mailtrap account
