import React, { Suspense, lazy, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Shared components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import ProtectedRoute from "./pages/admin/ProtectedRoute";
import Loader from "./components/loader/Loader";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";

// Firebase
import { messaging } from "./Firebase";
import { onMessage, getToken } from "firebase/messaging";

// Eager-load Home for faster FCP/LCP
import Home from "./pages/home/Home";

// Lazy-loaded pages
const Blog = lazy(() => import("./pages/blog/Blog"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const About = lazy(() => import("./pages/about/About"));
const Dashboard = lazy(() => import("./pages/admin/adminDashboard/Dashboard"));
const SinglePost = lazy(() => import("./pages/blog/SinglePost"));

// FCM VAPID key
const VAPID_KEY = "BO6gTLciyTn4U3v9h5Z7RIcRcFjMjkMNZhSfMBRNhhps8_ELBbnzrug9rGaIbBVfbMDbmtN_0Ha5Bm5kcuR9Pfw";

const App = () => {
  // Generate FCM token and send to server
  const generateTokenAndSendToServer = useCallback(async () => {
    try {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!currentToken) return console.log("No FCM token available.");

      console.log("FCM Token:", currentToken);
      await fetch("https://fcm-server-sigma.vercel.app/store-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: currentToken }),
      });
    } catch (err) {
      console.error("Error retrieving FCM token:", err);
    }
  }, []);

  useEffect(() => {
    generateTokenAndSendToServer();

    // Set up onMessage listener and cleanup to prevent leaks
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
    });

    return () => unsubscribe();
  }, [generateTokenAndSendToServer]);

  return (
    <main>
      <BrowserRouter>
        <AnalyticsTracker />
        <Navbar />

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/post/:id" element={<SinglePost />} />
          </Routes>
        </Suspense>

        <Footer />
      </BrowserRouter>
    </main>
  );
};

export default App;
