// Modern Trending Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    
    // Generate time slots on page load
    generateTimeSlots();
    
    // Event listeners
    dateInput.addEventListener('change', generateTimeSlots);
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
    document.getElementById('searchBooking').addEventListener('click', searchBooking);

    
    // Login system event listeners
    document.getElementById('loginIcon').addEventListener('click', openLoginModal);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Modal close event listeners
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
});

// Initialize application
function initializeApp() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .booking-form, .cancel-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Generate time slots with modern styling
function generateTimeSlots() {
    const dateInput = document.getElementById('date');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedDate = dateInput.value;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    
    // Clear existing slots
    timeSlotsContainer.innerHTML = '';
    
    // Time slots from 9 AM to 10 PM (1-hour intervals in 12-hour format)
    const timeSlots = [
        '09:00 AM-10:00 AM', '10:00 AM-11:00 AM', '11:00 AM-12:00 PM', '12:00 PM-01:00 PM', '01:00 PM-02:00 PM', 
        '02:00 PM-03:00 PM', '03:00 PM-04:00 PM', '04:00 PM-05:00 PM', '05:00 PM-06:00 PM', '06:00 PM-07:00 PM', 
        '07:00 PM-08:00 PM', '08:00 PM-09:00 PM', '09:00 PM-10:00 PM'
    ];
    
    timeSlots.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.dataset.time = time;
        
        // Format time for display (extract start time from range)
        const startTime = time.split('-')[0];
        const timeObj = new Date(`2000-01-01T${startTime}`);
        const displayTime = timeObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        slot.textContent = time; // Show full time range
        
        // Check if slot is in the past for today
        if (selectedDate === today) {
            const startTime = time.split('-')[0].trim();
            // Convert 12-hour format to 24-hour for comparison
            const timeParts = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
            if (timeParts) {
                let hour = parseInt(timeParts[1]);
                const minute = timeParts[2];
                const period = timeParts[3];
                
                if (period === 'PM' && hour !== 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
                
                const slotTime = new Date(`2000-01-01T${hour.toString().padStart(2, '0')}:${minute}`);
                const currentTimeOnly = new Date(`2000-01-01T${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`);
                
                if (slotTime < currentTimeOnly) {
                    // Skip past slots - don't add them to the display
                    return;
                }
            }
        }
        
        // Check if slot is booked
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const isBooked = bookings.some(booking => 
            booking.date === selectedDate && 
            booking.time === time && 
            booking.status !== 'cancelled'
        );
        
        if (isBooked) {
            slot.classList.add('booked');
            slot.textContent = time + ' ✓ Booked';
        }
        
        if (isBooked) {
            slot.classList.add('booked');
        }
        
        // Add click event for available slots
        if (!slot.classList.contains('booked') && !slot.classList.contains('past')) {
            slot.addEventListener('click', () => selectTimeSlot(slot));
        }
        
        timeSlotsContainer.appendChild(slot);
    });
}

// Select time slot with animation
function selectTimeSlot(selectedSlot) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection with animation
    selectedSlot.classList.add('selected');
    selectedSlot.style.transform = 'scale(1.05)';
    setTimeout(() => {
        selectedSlot.style.transform = '';
    }, 200);
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const selectedSlot = document.querySelector('.time-slot.selected');
    
    if (!selectedSlot) {
        showNotification('Please select a time slot', 'error');
        return;
    }
    
    const booking = {
        id: generateBookingId(),
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: selectedSlot.dataset.time,
        status: 'pending',
        paymentMethod: 'upi',
        amount: 10,
        createdAt: new Date().toISOString()
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    showNotification('Booking submitted successfully! Please complete the UPI payment.', 'success');
    
    // Reset form
    e.target.reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    generateTimeSlots();
    
    // Remove selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Simulate payment confirmation after 5 seconds
    setTimeout(() => {
        booking.status = 'confirmed';
        const updatedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const bookingIndex = updatedBookings.findIndex(b => b.id === booking.id);
        if (bookingIndex !== -1) {
            updatedBookings[bookingIndex] = booking;
            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            showNotification('Payment confirmed! Your booking is now active.', 'success');
        }
    }, 5000);
}

// Search booking by mobile number
function searchBooking() {
    const mobile = document.getElementById('cancelMobile').value.trim();
    
    if (!mobile) {
        showNotification('Please enter your mobile number', 'error');
        return;
    }
    
    if (!/^\d{10}$/.test(mobile)) {
        showNotification('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = bookings.filter(booking => 
        booking.mobile === mobile && booking.status !== 'cancelled'
    );
    
    const bookingDetails = document.getElementById('bookingDetails');
    
    if (userBookings.length === 0) {
        bookingDetails.innerHTML = `
            <div class="booking-info">
                <div class="booking-info-item">
                    <span class="booking-info-label">No bookings found</span>
                    <span class="booking-info-value">Please check your mobile number</span>
                </div>
            </div>
        `;
        bookingDetails.style.display = 'block';
        return;
    }
    
    // Show the most recent booking
    const latestBooking = userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    
    const timeObj = new Date(`2000-01-01T${latestBooking.time}`);
    const displayTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const canCancel = canCancelBooking(latestBooking);
    const timeRemaining = getTimeRemaining(latestBooking);
    
    bookingDetails.innerHTML = `
        <div class="booking-info">
            <div class="booking-info-item">
                <span class="booking-info-label">Booking ID:</span>
                <span class="booking-info-value">${latestBooking.id}</span>
            </div>
            <div class="booking-info-item">
                <span class="booking-info-label">Name:</span>
                <span class="booking-info-value">${latestBooking.name}</span>
            </div>
            <div class="booking-info-item">
                <span class="booking-info-label">Date:</span>
                <span class="booking-info-value">${formatDate(latestBooking.date)}</span>
            </div>
            <div class="booking-info-item">
                <span class="booking-info-label">Time:</span>
                <span class="booking-info-value">${latestBooking.time}</span>
            </div>
            <div class="booking-info-item">
                <span class="booking-info-label">Status:</span>
                <span class="booking-info-value">${getStatusBadge(latestBooking.status)}</span>
            </div>
            <div class="booking-info-item">
                <span class="booking-info-label">Amount:</span>
                <span class="booking-info-value">₹${latestBooking.amount}</span>
            </div>
            <div class="booking-info-item">
                <span class="booking-info-label">Time Remaining:</span>
                <span class="booking-info-value ${timeRemaining === 'Booking time has passed' ? 'text-danger' : ''}">${timeRemaining}</span>
            </div>
        </div>
        ${canCancel ? 
            `<button class="cancel-btn" onclick="cancelBooking('${latestBooking.id}')">
                <i class="fas fa-times"></i> Cancel Booking
            </button>` : 
            `<div class="cancel-notice">
                <i class="fas fa-info-circle"></i>
                ${latestBooking.status === 'cancelled' ? 
                    'This booking has already been cancelled.' : 
                    'Cancellation is only allowed up to 10 minutes before the booking time.'
                }
            </div>`
        }
    `;
    
    bookingDetails.style.display = 'block';
}



// Check if booking can be cancelled
function canCancelBooking(booking) {
    // Parse the time range to get start time
    const timeRange = booking.time;
    const startTime = timeRange.split('-')[0].trim();
    
    // Convert 12-hour format to 24-hour for comparison
    const timeParts = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!timeParts) return false;
    
    let hour = parseInt(timeParts[1]);
    const minute = timeParts[2];
    const period = timeParts[3];
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    // Create booking date time
    const bookingDateTime = new Date(`${booking.date}T${hour.toString().padStart(2, '0')}:${minute}:00`);
    const currentDateTime = new Date();
    const timeDifference = bookingDateTime - currentDateTime;
    const minutesDifference = timeDifference / (1000 * 60);
    
    // Can cancel if more than 10 minutes before booking time and booking is not already cancelled
    return minutesDifference > 10 && booking.status !== 'cancelled';
}

// Get time remaining until booking
function getTimeRemaining(booking) {
    const timeRange = booking.time;
    const startTime = timeRange.split('-')[0].trim();
    
    const timeParts = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!timeParts) return null;
    
    let hour = parseInt(timeParts[1]);
    const minute = timeParts[2];
    const period = timeParts[3];
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const bookingDateTime = new Date(`${booking.date}T${hour.toString().padStart(2, '0')}:${minute}:00`);
    const currentDateTime = new Date();
    const timeDifference = bookingDateTime - currentDateTime;
    const minutesDifference = timeDifference / (1000 * 60);
    
    if (minutesDifference <= 0) {
        return 'Booking time has passed';
    }
    
    const hours = Math.floor(minutesDifference / 60);
    const minutes = Math.floor(minutesDifference % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    } else {
        return `${minutes}m remaining`;
    }
}

// Cancel booking
function cancelBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
        showNotification('Booking not found', 'error');
        return;
    }
    
    if (!canCancelBooking(booking)) {
        const timeRemaining = getTimeRemaining(booking);
        showNotification(`Cannot cancel booking. ${timeRemaining}`, 'error');
        return;
    }
    
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            showNotification(`Booking cancelled successfully! The time slot "${booking.time}" is now available for new bookings.`, 'success');
            
            // Refresh booking details
            setTimeout(() => {
                searchBooking();
            }, 1000);
            
            // Refresh time slots to show the unlocked slot
            const dateInput = document.getElementById('date');
            if (dateInput && dateInput.value === booking.date) {
                generateTimeSlots();
                
                // Highlight the newly unlocked slot briefly
                setTimeout(() => {
                    const unlockedSlot = document.querySelector(`[data-time="${booking.time}"]`);
                    if (unlockedSlot && !unlockedSlot.classList.contains('booked')) {
                        unlockedSlot.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                        unlockedSlot.style.color = '#fff';
                        unlockedSlot.style.transform = 'scale(1.1)';
                        unlockedSlot.style.boxShadow = '0 10px 30px rgba(40, 167, 69, 0.3)';
                        
                        setTimeout(() => {
                            unlockedSlot.style.background = '';
                            unlockedSlot.style.color = '';
                            unlockedSlot.style.transform = '';
                            unlockedSlot.style.boxShadow = '';
                        }, 2000);
                    }
                }, 100);
            }
        }
    }
}

// Generate unique booking ID
function generateBookingId() {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="status-badge status-pending">Pending</span>',
        'confirmed': '<span class="status-badge status-confirmed">Confirmed</span>',
        'cancelled': '<span class="status-badge status-cancelled">Cancelled</span>'
    };
    return badges[status] || status;
}

// Show notification with modern styling
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Add status badge styles
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .status-confirmed {
        background: #d4edda;
        color: #155724;
    }
    
    .status-pending {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-cancelled {
        background: #f8d7da;
        color: #721c24;
    }
`;
document.head.appendChild(style);

// Login system functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeModals() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('bookingsModal').style.display = 'none';
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Admin credentials
    const ADMIN_CREDENTIALS = {
        username: 'kirankiru18',
        password: 'kirankumar@kirankumar68686'
    };
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Close login modal
        document.getElementById('loginModal').style.display = 'none';
        
        // Show success message
        showNotification('Login successful! Loading bookings...', 'success');
        
        // Load and display all bookings
        setTimeout(() => {
            displayAllBookings();
        }, 1000);
    } else {
        showNotification('Invalid username or password. Please try again.', 'error');
        document.getElementById('password').value = '';
    }
}

function displayAllBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingsList = document.getElementById('allBookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <h3>No bookings found</h3>
                <p>There are no bookings in the system yet.</p>
            </div>
        `;
    } else {
        // Sort bookings by date (newest first)
        bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        bookingsList.innerHTML = `
            <div class="bookings-header">
                <h3>All Bookings (${bookings.length})</h3>
            </div>
            <div class="bookings-grid">
                ${bookings.map(booking => {
                    const createdDate = new Date(booking.createdAt);
                    const ageInHours = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60));
                    const ageInDays = Math.floor(ageInHours / 24);
                    const ageText = ageInDays > 0 ? `${ageInDays} days ago` : `${ageInHours} hours ago`;
                    
                    const canCancel = canCancelBooking(booking);
                    
                    return `
                        <div class="booking-card ${booking.status}">
                            <div class="booking-header">
                                <div class="booking-id">${booking.id}</div>
                                <div class="booking-status ${booking.status}">${booking.status.toUpperCase()}</div>
                            </div>
                            
                            <div class="booking-details">
                                <div class="detail-section">
                                    <h4><i class="fas fa-user"></i> Customer Information</h4>
                                    <p><strong>Name:</strong> ${booking.name}</p>
                                    <p><strong>Mobile:</strong> ${booking.mobile}</p>
                                    <p><strong>Email:</strong> ${booking.email}</p>
                                </div>
                                
                                <div class="detail-section">
                                    <h4><i class="fas fa-calendar-alt"></i> Session Details</h4>
                                    <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                                    <p><strong>Time:</strong> ${booking.time}</p>
                                    <p><strong>Duration:</strong> 1 Hour</p>
                                </div>
                                
                                <div class="detail-section">
                                    <h4><i class="fas fa-credit-card"></i> Payment Information</h4>
                                    <p><strong>Method:</strong> ${booking.paymentMethod || 'UPI'}</p>
                                    <p><strong>Amount:</strong> ₹${booking.amount || 10}</p>
                                    <p><strong>UPI ID:</strong> varun173205@axl</p>
                                </div>
                                
                                <div class="detail-section">
                                    <h4><i class="fas fa-info-circle"></i> Additional Info</h4>
                                    <p><strong>Created:</strong> ${createdDate.toLocaleString()}</p>
                                    <p><strong>Age:</strong> ${ageText}</p>
                                    <p><strong>Studio:</strong> KKR Studios</p>
                                </div>
                            </div>
                            
                            <div class="booking-actions">
                                ${canCancel ? `<button class="btn btn-cancel" onclick="cancelBooking('${booking.id}')">
                                    <i class="fas fa-times"></i> Cancel Booking
                                </button>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Show bookings modal
    document.getElementById('bookingsModal').style.display = 'block';
}

 