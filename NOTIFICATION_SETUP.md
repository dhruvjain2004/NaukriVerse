# Notification Feature - Installation & Setup Guide

## What Was Added

A complete notification system where:
- Users see a **bell icon** in the navbar (top-right, only when logged in)
- Clicking the bell opens a **popup** showing new jobs posted by recruiters
- Each notification displays: **Job Title**, **Company Name**, **Role**, and **Posted Time**
- Users can **mark notifications as read**

---

## Installation Steps

### Step 1: Update Backend Imports
Ensure the Notification model is imported in the necessary controllers.

**Already Done:**
- ✅ `server/models/Notification.js` - Created
- ✅ `server/controllers/userController.js` - Updated with notification functions
- ✅ `server/controllers/companyController.js` - Updated to create notifications when job is posted
- ✅ `server/routes/userRoutes.js` - Added notification endpoints

### Step 2: Frontend Component Integration
The notification component is already created and integrated.

**Already Done:**
- ✅ `client/src/components/NotificationPopup.jsx` - Created
- ✅ `client/src/components/Navbar.jsx` - Updated with bell icon
- ✅ `client/src/context/AppContext.jsx` - Updated with notification state

### Step 3: Database Setup
Make sure MongoDB is running and collections will be auto-created.

---

## File Changes Summary

### New Files Created:
1. `server/models/Notification.js` - Notification schema
2. `client/src/components/NotificationPopup.jsx` - Notification popup component
3. `NOTIFICATION_FEATURE.md` - Feature documentation

### Modified Files:
1. `server/controllers/userController.js` - Added 2 new functions
2. `server/controllers/companyController.js` - Enhanced postJob function
3. `server/routes/userRoutes.js` - Added 2 new routes
4. `client/src/components/Navbar.jsx` - Added notification icon
5. `client/src/context/AppContext.jsx` - Added notification state management

---

## Testing the Feature

### Test Case 1: View Notifications (User)
1. Login as a user
2. Look for bell icon (🔔) in navbar top-right
3. Click the bell icon
4. Popup should show list of new jobs

### Test Case 2: Post Job (Recruiter)
1. Login as a recruiter
2. Post a new job via dashboard
3. Login as different user
4. Check notifications - should see the new job

### Test Case 3: Mark as Read
1. Click a notification in the popup
2. Background color should change from blue to gray
3. "New" badge should disappear

### Test Case 4: Not Visible When Logged Out
1. Logout from user account
2. Bell icon should disappear from navbar
3. Only "Recruiter Login", "Login", "Register" links visible

---

## API Endpoints

### Get All Notifications
```
GET http://localhost:5000/api/users/new-job-notifications
Headers: 
  Authorization: Bearer {userToken}

Response:
{
  "success": true,
  "notifications": [
    {
      "_id": "...",
      "jobTitle": "Senior Developer",
      "companyName": "TechCorp",
      "jobRole": "backend",
      "read": false,
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

### Mark Notification as Read
```
PATCH http://localhost:5000/api/users/notifications/{notificationId}/read
Headers: 
  Authorization: Bearer {userToken}

Response:
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

## Features Implemented

✅ **Notification Bell Icon** - Located in navbar top-right  
✅ **Popup Display** - Shows new jobs with details  
✅ **Auto-creation** - Notifications created when recruiter posts job  
✅ **Mark as Read** - Users can mark notifications as read  
✅ **User-specific** - Each user sees all notifications  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Security** - Protected endpoints with user authentication  

---

## Future Enhancements

- 🔔 Real-time notifications using Socket.io
- 📧 Email notifications for new jobs
- 🔍 Filter notifications by category/location
- 🎵 Sound alerts
- 📊 Notification statistics/dashboard
- ⏰ Notification scheduling
- 📱 Push notifications for mobile app

---

## Troubleshooting

### Bell icon not showing
- Make sure you're logged in as a user
- Check browser console for any errors
- Verify AppContext is properly imported

### Notifications not appearing
- Verify backend is running
- Check MongoDB connection
- Make sure job is posted (triggers notification creation)
- Check user token is valid

### Popup not opening
- Verify NotificationPopup component is imported in Navbar
- Check browser console for errors
- Ensure proper CSS classes from Tailwind

---

## Notes

- Notifications are created for **ALL users** when a job is posted
- Each notification includes job details and timestamp
- Notifications are stored in MongoDB indefinitely
- Users can only view their own notifications (user-specific)
- No notification deletion implemented yet (can be added as feature)

---

## Support

For issues or questions:
1. Check NOTIFICATION_FEATURE.md for detailed documentation
2. Review the code files mentioned above
3. Check browser console for JavaScript errors
4. Verify backend API responses using Postman/Thunder Client
