# Admin Login Troubleshooting Guide

## Problem: Admin Panel Not Opening After Login

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try logging in and check for any error messages
4. Look for any red error messages or warnings

### Step 2: Test Login Flow
1. Open `test-login.html` in your browser
2. Click "Test Login" to simulate login
3. Click "Check Session" to verify session storage
4. Click "Test Redirect" to test the redirect

### Step 3: Manual Login Test
1. Go to `admin-login.html`
2. Enter credentials:
   - Username: `admin`
   - Password: `kkr2024`
3. Check browser console for debug messages
4. Wait for redirect to `admin.html`

### Step 4: Direct Access Test
1. Try accessing `admin.html` directly
2. If it redirects to login, the authentication is working
3. If it shows the admin panel, the issue is with the login redirect

### Step 5: Clear Browser Data
1. Clear browser cache and cookies
2. Clear session storage:
   - Open Developer Tools (F12)
   - Go to Application tab
   - Find Session Storage
   - Clear all data
3. Try logging in again

### Step 6: Check File Structure
Ensure all files are in the same folder:
- `admin-login.html`
- `admin-login.js`
- `admin.html`
- `admin-script.js`
- `admin-styles.css`

### Step 7: Use Local Server
Instead of opening files directly, use a local server:
1. Open command prompt in the project folder
2. Run: `python -m http.server 8000`
3. Open browser and go to: `http://localhost:8000`
4. Navigate to admin login from there

### Common Issues and Solutions

#### Issue 1: "admin.html not found"
**Solution**: Check if `admin.html` exists in the same folder

#### Issue 2: "Session not stored"
**Solution**: Check if JavaScript is enabled in browser

#### Issue 3: "Redirect not working"
**Solution**: Try using a local server instead of file:// protocol

#### Issue 4: "Authentication failed"
**Solution**: Clear session storage and try again

### Debug Commands
Open browser console and run these commands:

```javascript
// Check if session exists
console.log('Session:', sessionStorage.getItem('adminLoggedIn'));

// Clear session
sessionStorage.removeItem('adminLoggedIn');
sessionStorage.removeItem('adminLoginTime');

// Set session manually
sessionStorage.setItem('adminLoggedIn', 'true');
sessionStorage.setItem('adminLoginTime', Date.now().toString());

// Test redirect
window.location.href = 'admin.html';
```

### Quick Fix
If nothing else works:
1. Open `test-login.html`
2. Click "Test Login"
3. Click "Test Redirect"
4. This should take you directly to the admin panel

### Contact Support
If the issue persists:
1. Check browser console for error messages
2. Note the exact error message
3. Try in a different browser
4. Try using a local server instead of file:// protocol 