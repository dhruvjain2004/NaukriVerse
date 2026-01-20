# Adding 30 New Jobs to Your Job Portal

## Steps to Add the Jobs:

### 1. Make sure your MongoDB is running
Verify MongoDB connection is active.

### 2. Run the Seed Script
In your **server terminal**, run:

```bash
cd server
node scripts/seedDatabase.js
```

Or if you're using npm:

```bash
npm run seed
```

### 3. Expected Output
You should see:
```
Inserted 30 new job(s) across 5 companies ✅
```

### 4. Restart Backend Server
If the server is running with nodemon, it will auto-restart. Otherwise:

```bash
npm start
```

### 5. Refresh Your Frontend
- Hard refresh the browser: **Ctrl+F5** (or Cmd+Shift+R on Mac)
- Go to homepage
- You should now see all 40 jobs (10 original + 30 new)

## What's New:

✅ **30 new jobs** added across:
- Programming & Development
- Data & Analytics
- Design & UX
- Marketing
- Quality & Testing
- HR, Operations, and more

✅ **Better Pagination**:
- 12 jobs per page
- Smart page navigation (shows only relevant page numbers)
- Total jobs counter
- Previous/Next buttons
- Page indicator (e.g., "Page 1 of 4")

✅ **Backend Improvements**:
- API now supports pagination query parameters
- Jobs sorted by date (newest first)
- Better job fetching logic

## Troubleshooting:

### Jobs still not showing?
1. Check MongoDB is running
2. Run seed script again
3. Check browser console for errors
4. Hard refresh: Ctrl+F5

### Pagination not working?
1. Make sure you have more than 12 jobs
2. Check browser console for JavaScript errors
3. Refresh the page

### Seed script gives error?
Check that:
- MongoDB connection string is correct in `.env`
- You're in the server directory
- Node.js is installed properly

## Done! 🎉
Your job portal now has 40 jobs with professional pagination!
