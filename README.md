# KKR Studios Booking System

A modern, responsive booking website for KKR Studios with real-time slot management and payment integration.

## 🌟 Features

- **Real-time Booking**: 1-hour slot booking system
- **Payment Integration**: UPI, Card, and Cash payment options
- **QR Code Payments**: Easy UPI payment with QR code
- **Booking Management**: View and manage all bookings
- **Slot Management**: Real-time availability with 10-minute cancellation
- **Responsive Design**: Works on all devices
- **Modern UI**: Beautiful, professional interface

## 📋 Booking Hours

- **Monday to Friday**: 9 AM to 10 PM
- **Duration**: 1 hour per slot
- **Total Slots**: 13 slots per day
- **Cancellation**: Up to 10 minutes before booking time

## 🚀 Quick Deploy

### Option 1: Netlify (Easiest)
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag and drop this entire folder
3. Get your live URL instantly

### Option 2: GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Enable GitHub Pages in settings
4. Your site will be live at `https://username.github.io/repository-name`

### Option 3: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up and create new project
3. Upload this folder
4. Deploy with one click

## 📁 File Structure

```
kkr-studios-booking/
├── index.html              # Main booking page
├── styles.css              # Main styles
├── script.js               # Main JavaScript
├── bookings.html           # Booking list page
├── bookings-styles.css     # Booking list styles
├── bookings-script.js      # Booking list JavaScript

└── images/                 # Images folder (create this)
    ├── logo.png           # Studio logo
    └── studio.jpg         # Studio photo
```

## 🎨 Customization

### Adding Images
1. Create an `images` folder
2. Add your studio photos:
   - `logo.png` - Your studio logo (60x60px recommended)
   - `studio.jpg` - Studio interior photo

### Changing UPI ID
Edit `script.js` and replace `varun173205@axl` with your UPI ID

### Modifying Time Slots
Edit the time slots in `index.html` and update `getTimeSlotText()` functions

## 💳 Payment Setup

### UPI Payment
- UPI ID: `varun173205@axl`
- QR Code: Automatically generated
- Amount: ₹10 per hour

### Payment Methods
- ✅ Credit/Debit Card
- ✅ UPI Payment (with QR code)
- ✅ Cash on Arrival

## 🔧 Local Development

1. **Start local server**:
   ```bash
   python -m http.server 8000
   ```

2. **Open browser**: `http://localhost:8000`

3. **Test features**:
   - Make bookings
   - View booking list

## 📱 Mobile Responsive

The website is fully responsive and works perfectly on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ All screen sizes

## 🔒 Data Storage

- Uses browser localStorage for demo
- For production, connect to a database
- All booking data is stored locally

## 🎯 Live Demo

Once deployed, your website will be accessible at:
- Netlify: `https://your-site-name.netlify.app`
- Vercel: `https://your-site-name.vercel.app`
- GitHub Pages: `https://username.github.io/repository-name`

## 📞 Support

For any issues or customization requests, please contact the development team.

---

**KKR Studios Booking System** - Professional booking solution for creative studios. 