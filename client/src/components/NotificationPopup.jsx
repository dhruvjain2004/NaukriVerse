import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const NotificationPopup = ({ isOpen, onClose }) => {
  const { backendUrl, userToken, userNotifications, fetchUserNotifications } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userToken && fetchUserNotifications) {
      setLoading(true);
      fetchUserNotifications().then(() => setLoading(false));
    }
  }, [isOpen, userToken, fetchUserNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        backendUrl + `/api/users/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      // Refresh notifications after marking as read
      if (fetchUserNotifications) {
        fetchUserNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="absolute top-16 right-4 bg-white rounded-lg shadow-2xl w-96 max-w-sm z-50 max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center border-b">
          <h3 className="font-bold text-lg">New Jobs</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading notifications...</p>
            </div>
          ) : !userNotifications || userNotifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No new job notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                  }}
                >
                  <h4 className="font-semibold text-gray-800">
                    {notification.jobTitle}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Company: {notification.companyName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Role: {notification.jobRole}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                  {!notification.read && (
                    <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
