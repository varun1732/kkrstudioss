# KKR Studios - Admin Panel Access Guide

## 🔐 **Admin Login Credentials**

**Username:** `kirankiru18`  
**Password:** `kirankumar@kirankumar68686`

## 🚀 **How to Access Admin Panel**

1. **Open the website:** `http://localhost:8000`
2. **Click the admin icon** (shield icon) in the top-right corner
3. **Enter credentials:**
   - Username: `kirankiru18`
   - Password: `kirankumar@kirankumar68686`
4. **Click "Login to Admin Panel"**
5. **You'll be redirected to the admin panel**

## 📊 **Admin Panel Features**

### **After Login, You'll See:**

1. **Statistics Dashboard**
   - Total Bookings
   - Confirmed Bookings
   - Pending Bookings
   - Cancelled Bookings

2. **Booked Slots Overview**
   - Select any date to view all time slots
   - See which slots are booked, available, or past
   - View customer details for each booked slot:
     - Customer name, mobile, email
     - Booking ID and date
     - Payment information
     - Booking status

3. **Detailed Booking Information**
   - Click the "eye" icon to view full booking details
   - Comprehensive information including:
     - Booking age (how long ago it was created)
     - Customer contact details
     - Session details (date, time, duration)
     - Payment information (method, amount, UPI ID)
     - Studio and service information

4. **Booking Management**
   - Confirm payments
   - Cancel bookings
   - Filter and search bookings
   - View all booking history

## 🕐 **Time Slot Format**

All time slots are now in **12-hour format**:
- `09:00 AM-10:00 AM`
- `10:00 AM-11:00 AM`
- `11:00 AM-12:00 PM`
- `12:00 PM-01:00 PM`
- `01:00 PM-02:00 PM`
- `02:00 PM-03:00 PM`
- `03:00 PM-04:00 PM`
- `04:00 PM-05:00 PM`
- `05:00 PM-06:00 PM`
- `06:00 PM-07:00 PM`
- `07:00 PM-08:00 PM`
- `08:00 PM-09:00 PM`
- `09:00 PM-10:00 PM`

## 🔍 **Booking Details Display**

When you click on a booking, you'll see:

### **Booking Information**
- Booking ID
- Status (Confirmed/Pending/Cancelled)
- Created date and time
- Age of booking

### **Customer Information**
- Full name
- Mobile number
- Email address

### **Session Details**
- Booking date
- Time slot (1-hour duration)
- Studio information

### **Payment Information**
- Payment method (UPI)
- Amount (₹10)
- UPI ID (varun173205@axl)

### **Additional Information**
- Studio name (KKR Studios)
- Service type (Photography & Videography)
- Rate (₹10 per hour)

## 🛡️ **Security Features**

- **Session Management:** 8-hour session timeout
- **Automatic Logout:** Session expires after 8 hours
- **Secure Access:** Only admin can access booking details
- **Real-time Updates:** Auto-refresh every 30 seconds

## 📱 **Mobile Responsive**

The admin panel works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 **Troubleshooting**

If you can't access the admin panel:

1. **Check credentials:** Ensure username and password are correct
2. **Clear browser cache:** Refresh the page
3. **Check console:** Open browser developer tools for errors
4. **Use local server:** Make sure you're running `python -m http.server 8000`

## 📞 **Support**

For technical support or issues:
- Check the browser console for error messages
- Ensure all files are in the correct directory
- Verify the local server is running

---

**Last Updated:** January 2024  
**Version:** 2.0 (12-hour format + enhanced booking details) 