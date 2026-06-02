# ProConnect: Professional Social Network

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![MUI](https://img.shields.io/badge/Material--UI-v5-0081CB)

ProConnect is a modern, responsive, and fully-featured professional social networking application built on the MERN stack (MongoDB, Express, React, Node.js). It features a sleek 3-column layout reminiscent of major professional networks, offering a premium user experience without relying on CSS frameworks like Tailwind.

---

## ✨ Key Features

- **Robust Authentication**: Secure JWT-based Login and Registration system with fully redesigned split-pane UI.
- **Dynamic Networking**: Browse the "Network" page to discover other users, filter by name in real-time, and build connections.
- **Rich Media Posts**: Create, delete, and interact with posts. Features a robust file upload system powered by `multer` for profile avatars and post images.
- **Interactive Feed**: Real-time Like toggling, Repost functionality, and nested Comment threads.
- **Save for Later**: Bookmark posts securely to your local storage and access them via the dedicated "Saved Posts" view.
- **Real-Time Analytics**: Visual dashboard tracking your total posts, likes, and comments received.
- **Seamless Messaging**: A sliding split-pane Messages Drawer allowing you to interface with your network directly.
- **Modern UI Architecture**: Built entirely with React and Material-UI (MUI), strictly adhering to professional design paradigms, glassmorphism, and responsive breakpoints.

---

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**: Lightning-fast development environment and optimized production builds.
- **Material-UI (MUI)**: Core UI component library and iconography.
- **Axios**: Interceptor-configured HTTP client for robust API communication.
- **React Router**: Client-side routing and layout management.

### Backend
- **Node.js & Express**: Scalable, non-blocking REST API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database with strict schema modeling.
- **JWT & Bcrypt**: Industry-standard security for password hashing and stateless session management.
- **Multer**: Middleware for handling `multipart/form-data` for seamless image uploads.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   - Copy `.env.example` to `.env`
   - Fill in your `MONGO_URI` and define a secure `JWT_SECRET`.
4. Start the development server:
   ```bash
   npm start
   ```
   *Note: The backend will automatically create an `/uploads` folder to handle physical media storage.*

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   - Copy `.env.example` to `.env`
   - Set `VITE_API_URL` to your backend URL (e.g., `http://localhost:5000`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 📦 Deployment

### Backend (Render / Heroku)
1. Push your repository to GitHub.
2. Link your repository to your cloud provider (e.g., Render Web Services).
3. Ensure you add `MONGO_URI` and `JWT_SECRET` to your production environment variables.
4. *Important: Since Render spins down free-tier instances, physical file uploads (`/uploads`) may wipe between restarts. Consider migrating `multer` storage to AWS S3 or Cloudinary for production durability.*

### Frontend (Vercel / Netlify)
1. Import the `frontend` directory into your Vercel/Netlify dashboard.
2. Set the `VITE_API_URL` environment variable to point to your deployed backend URL.
3. Deploy!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is licensed under the MIT License.
