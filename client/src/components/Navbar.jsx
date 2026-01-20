import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // Adjust the path as necessary
import { AppContext } from "../context/AppContext";
import NotificationPopup from "./NotificationPopup";

const Navbar = () => {
  const { setShowRecruiterLogin, userData, logoutUser, userNotifications } = useContext(AppContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isLoggedIn = Boolean(userData);
  
  // Count unread notifications
  const unreadCount = userNotifications?.filter(notif => !notif.read).length || 0;

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const authLinks = isLoggedIn ? (
    <>
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition"
        title="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      <Link to={"/applications"}>Applied Jobs</Link>
      <p>|</p>
      <Link to="/dashboard" className="bg-gray-800 text-white px-4 py-2 rounded">
        Dashboard
      </Link>
      <Link to="/profile" className="text-gray-700">
        Hi, {userData?.name?.split(" ")[0] || "User"}
      </Link>
      <button onClick={handleLogout} className="text-red-500 text-sm">
        Logout
      </button>
      <Link to="/admin-auth" className="text-gray-500 text-sm underline">
        Admin
      </Link>
    </>
  ) : (
    <>
      <button className="text-gray-600" onClick={() => setShowRecruiterLogin(true)}>
        Recruiter Login
      </button>
      <Link to="/login" className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full">
        Login
      </Link>
      <Link to="/register" className="text-blue-600 font-medium">
        Register
      </Link>
      <Link to="/admin-auth" className="text-gray-500 text-sm underline">
        For Admin
      </Link>
    </>
  );

  const mobileMenu = isLoggedIn ? (
    <>
      <Link to={"/applications"} onClick={() => setMobileMenuOpen(false)}>
        Applied Jobs
      </Link>
      <Link
        to="/dashboard"
        className="bg-gray-800 text-white px-4 py-2 rounded"
        onClick={() => setMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        to="/profile"
        className="text-gray-700"
        onClick={() => setMobileMenuOpen(false)}
      >
        Hi, {userData?.name || "User"}
      </Link>
      <button className="text-red-500 text-left" onClick={handleLogout}>
        Logout
      </button>
      <Link to="/admin-auth" className="text-gray-500" onClick={() => setMobileMenuOpen(false)}>
        Admin
      </Link>
    </>
  ) : (
    <>
      <button
        className="text-gray-600 text-left"
        onClick={() => {
          setShowRecruiterLogin(true);
          setMobileMenuOpen(false);
        }}
      >
        Recruiter Login
      </button>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-6 py-2 rounded-full w-full text-left text-center"
        onClick={() => setMobileMenuOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/register"
        className="text-blue-600 font-medium text-left"
        onClick={() => setMobileMenuOpen(false)}
      >
        Register
      </Link>
      <Link
        to="/admin-auth"
        className="text-gray-500 text-left underline"
        onClick={() => setMobileMenuOpen(false)}
      >
        Admin
      </Link>
    </>
  );

  return (
    <>
      <div className="shadow py-4">
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center relative">
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={assets.vite_logo} alt="NaukriVerse Symbol" height={40} width={40} />
            <span className="font-bold text-xl ml-2">JobMate AI</span>
          </div>
          {/* Hamburger for mobile */}
          <button className="sm:hidden ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-3">{authLinks}</div>
          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded p-4 flex flex-col gap-3 w-48 z-50 sm:hidden animate-fade-in">
              {mobileMenu}
            </div>
          )}
        </div>
      </div>
      {/* Notification Popup */}
      <NotificationPopup isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  );
};

export default Navbar;
