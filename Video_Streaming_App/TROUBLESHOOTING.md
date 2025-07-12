# Registration Issue Troubleshooting Guide

## Problem
Only able to login with one user. When trying to register with another email, getting an error.

## Debug Steps

### 1. Check Environment Variables
Make sure these environment variables are set in your `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### 2. Test Database Connection
Use the debug panel in the bottom-right corner of the app:
- Click "Test DB" to check if database connection is working
- Click "Test Reg" to test registration with a random user
- Click "Clear" to clear test results
- Click "×" to hide the debug panel

### 3. Check Console Logs
Look at the browser console and server console for error messages.

### 4. Common Issues and Solutions

#### Issue: "User already exists" error
- **Cause**: Email or username already exists in database
- **Solution**: Use a different email/username or clear the database

#### Issue: "Validation errors"
- **Cause**: Username/email doesn't meet requirements
- **Solution**: 
  - Username: 3-20 characters, letters/numbers/underscores only
  - Email: Valid email format
  - Password: At least 6 characters

#### Issue: "Server error" or "Registration failed"
- **Cause**: Database connection or JWT issues
- **Solution**: Check environment variables and database connection

#### Issue: "MongoDB connection failed"
- **Cause**: Database connection string or network issues
- **Solution**: 
  - Check MongoDB Atlas connection string
  - Ensure IP is whitelisted in MongoDB Atlas
  - Check if MongoDB cluster is running

### 5. Manual Testing
Try registering with these test credentials:
```
Username: testuser123
Email: test123@example.com
Password: testpass123
```

### 6. Database Reset (if needed)
If you want to start fresh:
1. Go to MongoDB Atlas
2. Delete the existing database
3. The app will create a new one when you register

### 7. Check Network Tab
1. Open browser DevTools
2. Go to Network tab
3. Try to register
4. Look for the `/auth/register` request
5. Check the response for error details

## Debug Panel Features
The debug panel (bottom-right corner) provides:
- **Test DB**: Check database connection and user count
- **Test Reg**: Automatically test registration with random credentials
- **Clear**: Clear test results
- **×**: Hide debug panel (click "Debug" button to show again)

## Expected Behavior
- First user registration should work
- Second user with different email should work
- Same email should give "User already exists" error
- Invalid data should give validation errors

## If Still Having Issues
1. Check the server console for detailed error logs
2. Verify all environment variables are set
3. Test with the debug panel
4. Check MongoDB Atlas dashboard for connection issues 