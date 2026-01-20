# Notification System - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Navbar                                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Logo    |  Search  | Applied Jobs | Dashboard | Bell Icon │ │
│  │         |          |              |           |    [!]     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ▼                                    │
│  NotificationPopup (Overlay)                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ═══ New Jobs ═════════════════ [×]                         │ │
│  │                                                             │ │
│  │ ┌─────────────────────────────────────────────────────┐   │ │
│  │ │ Senior Developer (NEW BADGE)                    [!] │   │ │
│  │ │ Company: TechCorp                                   │   │ │
│  │ │ Role: Backend Development                           │   │ │
│  │ │ Posted: 20 Jan 2024 10:30 AM                        │   │ │
│  │ └─────────────────────────────────────────────────────┘   │ │
│  │                                                             │ │
│  │ ┌─────────────────────────────────────────────────────┐   │ │
│  │ │ Frontend Engineer                                   │   │ │
│  │ │ Company: StartupXYZ                                 │   │ │
│  │ │ Role: Frontend                                      │   │ │
│  │ │ Posted: 19 Jan 2024 03:15 PM                        │   │ │
│  │ └─────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
RECRUITER SIDE                          USER SIDE
═══════════════════════════════════════════════════════════════════

Recruiter Login                         User Login
     │                                      │
     ▼                                      ▼
Recruiter Dashboard                     User Navbar
     │                                      │
     │                                      ├─> Check AppContext
     │                                      │    (userToken exists?)
     │                                      │
Post New Job Form                       YES → Fetch Notifications
     │                                      │
     ├─ Job Title                           ├─> GET /api/users/
     ├─ Description                         │    new-job-notifications
     ├─ Salary                              │
     ├─ Location                            └─> Display Bell Icon 🔔
     ├─ Category                                    │
     └─ Skills                                     │
                                                    │ User Clicks Bell
         API POST /api/jobs                        │
             │                                     ▼
             ▼                           Fetch All Notifications
        Create Job in DB                         │
             │                                    ▼
             ├─ Generate Job ID          Display NotificationPopup
             │
             └─> Create Notifications
                 FOR ALL USERS
                 
              Job: {
                _id: xxx,
                title: "Senior Dev",
                ...
              }
              
              For Each User in DB:
              └─> Create Notification {
                  userId: user._id,
                  jobId: job._id,
                  companyId: company._id,
                  jobTitle: "Senior Dev",
                  jobRole: "backend",
                  companyName: "TechCorp",
                  read: false
              }
              
              Store in MongoDB
                    │
                    ▼
            Notifications Collection
            [Notification 1, 2, 3, ...]
```

## Component Hierarchy

```
App
│
├── Navbar
│   ├── Logo
│   ├── Desktop Menu
│   │   ├── Notification Button (Bell Icon) ◄─── NEW
│   │   │   └── NotificationPopup ◄─── NEW
│   │   │       ├── Notification Item 1
│   │   │       ├── Notification Item 2
│   │   │       └── Notification Item N
│   │   ├── Applied Jobs Link
│   │   ├── Dashboard Link
│   │   └── Logout Button
│   │
│   └── Mobile Menu
│       ├── Applied Jobs Link
│       ├── Dashboard Link
│       └── Logout Button
│
├── AppContext (Provider) ◄─── ENHANCED
│   ├── userToken
│   ├── userData
│   ├── userApplications
│   ├── userNotifications ◄─── NEW
│   ├── fetchUserNotifications() ◄─── NEW
│   └── Other context values
│
└── Other Components...
```

## State Management Flow

```
User Login
    │
    ▼
setUserToken (from login response)
    │
    ▼
useEffect triggered
    │
    ├─> fetchUserData()
    ├─> fetchUserApplications()
    └─> fetchUserNotifications() ◄─── NEW
           │
           ▼
        API Call: GET /api/users/new-job-notifications
           │
           ▼
        Response: { success: true, notifications: [...] }
           │
           ▼
        setUserNotifications(data.notifications)
           │
           ▼
        Navbar accesses userNotifications from context
           │
           ▼
        NotificationPopup renders with data
```

## Database Schema Relationships

```
┌──────────────────┐
│      User        │
├──────────────────┤
│ _id: ObjectId    │ ◄──────┐
│ name: String     │        │
│ email: String    │        │
│ ...              │        │
└──────────────────┘        │
                             │
        ┌─────────────────────────────────┐
        │     Notification               │
        ├─────────────────────────────────┤
        │ _id: ObjectId                   │
        │ userId: ObjectId ───────────────┤─── Ref to User
        │ jobId: ObjectId ───────────────┐│
        │ companyId: ObjectId ───────────┤├─ Ref to Job
        │ jobTitle: String               ││
        │ jobRole: String                ││
        │ companyName: String            ││
        │ read: Boolean                  ││
        │ createdAt: Date                ││
        └─────────────────────────────────┘│
                                            │
                          ┌─────────────────┴─┐
                          │                   │
                    ┌─────▼────────┐  ┌──────▼────────┐
                    │     Job      │  │    Company    │
                    ├──────────────┤  ├───────────────┤
                    │ _id: ObjectId│  │ _id: ObjectId │
                    │ title        │  │ name: String  │
                    │ description  │  │ email: String │
                    │ location     │  │ ...           │
                    │ salary       │  └───────────────┘
                    │ category     │
                    │ ...          │
                    └──────────────┘
```

## User Journey

```
START: User logs in
    │
    ▼
Navbar loads with UserData
    │
    ├─ User logged in? YES
    │      │
    │      ▼
    │  Display Bell Icon 🔔 in top-right
    │      │
    │      ▼
    │  (Background) Fetch notifications from server
    │      │
    │      ▼
    │  Notifications displayed in React state
    │
    └─ NOT logged in? NO
           │
           ▼
       Hide Bell Icon
       Show Recruiter Login, Login, Register buttons


USER ACTION: Click Bell Icon
    │
    ▼
Toggle NotificationPopup visibility
    │
    ▼
Popup loads and displays notifications
    │
    └─ Notification Item 1
       ├─ Job Title: "Senior Developer"
       ├─ Company: "TechCorp"
       ├─ Role: "Backend"
       ├─ Date: "20 Jan 10:30"
       ├─ Status: Unread (blue bg, NEW badge)
       │
       └─ User clicks on notification
          │
          ▼
          Mark as Read (API call)
             │
             ▼
          Background changes from blue to gray
          NEW badge removed
          read: true saved in DB


USER ACTION: Click Close [×] or outside popup
    │
    ▼
Popup closes
    │
    ▼
Return to normal navbar view
```

## API Request/Response Flow

### Get Notifications Request
```
REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET /api/users/new-job-notifications HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

RESPONSE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
200 OK
{
  "success": true,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "jobId": "507f1f77bcf86cd799439013",
      "companyId": "507f1f77bcf86cd799439014",
      "jobTitle": "Senior Backend Developer",
      "jobRole": "Backend Development",
      "companyName": "TechCorp Inc.",
      "read": false,
      "createdAt": "2024-01-20T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "jobTitle": "Frontend Engineer",
      "jobRole": "Frontend",
      "companyName": "StartupXYZ",
      "read": true,
      "createdAt": "2024-01-19T15:30:00.000Z"
    }
  ]
}
```

### Mark as Read Request
```
REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATCH /api/users/notifications/507f1f77bcf86cd799439011/read HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

RESPONSE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
200 OK
{
  "success": true,
  "message": "Notification marked as read.",
  "notification": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "jobId": "507f1f77bcf86cd799439013",
    "companyId": "507f1f77bcf86cd799439014",
    "jobTitle": "Senior Backend Developer",
    "jobRole": "Backend Development",
    "companyName": "TechCorp Inc.",
    "read": true,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "__v": 0
  }
}
```

## Security & Permissions

```
┌─────────────────────────────────────┐
│  Middleware: protectUser            │
├─────────────────────────────────────┤
│                                     │
│  1. Check Authorization Header      │
│     Get Bearer Token                │
│                                     │
│  2. Verify JWT Token                │
│     Extract user._id                │
│                                     │
│  3. Fetch User from DB              │
│     Set req.user = User Data        │
│                                     │
│  4. Pass control to controller      │
│     OR return 401 Unauthorized      │
│                                     │
└─────────────────────────────────────┘
         │
         ▼
    protected Routes:
    ├─ GET /api/users/new-job-notifications ✓ protectUser
    └─ PATCH /api/users/notifications/:id/read ✓ protectUser
    
    └─ Each notification can only be marked
       as read by the user it belongs to
       (verified in controller)
```

## Performance Considerations

```
Optimizations implemented:
─────────────────────────
✓ Notifications sorted by latest first (createdAt: -1)
✓ Limit results to 20 recent notifications
✓ Only fetch when popup is opened (lazy loading)
✓ Use context to avoid prop drilling
✓ Populate only necessary fields from related documents
✓ Single query to database per fetch

Future optimizations:
────────────────────
□ Pagination for older notifications
□ WebSocket for real-time updates
□ Caching at client-side
□ Background refresh using Web Workers
□ Notification batching during job posting
□ Archive/delete old notifications
```

---

This architecture ensures:
- **Scalability**: Can handle multiple users and jobs
- **Security**: User authentication and authorization
- **Performance**: Efficient queries and lazy loading
- **User Experience**: Real-time responsive interface
- **Maintainability**: Clear separation of concerns
