// Check admin authentication
function checkAdminAuth() {
    console.log('Checking admin authentication...');
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    console.log('Session data:', { isLoggedIn, loginTime });
    
    if (!isLoggedIn || !loginTime) {
        console.log('No valid session found, redirecting to login...');
        window.location.href = 'admin-login.html';
        return false;
    }
    
    // Check if session is expired (8 hours)
    const currentTime = Date.now();
    const sessionTime = parseInt(loginTime);
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    
    console.log('Session time check:', { currentTime, sessionTime, sessionDuration });
    
    if (currentTime - sessionTime > sessionDuration) {
        // Session expired
        console.log('Session expired, clearing and redirecting...');
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        window.location.href = 'admin-login.html';
        return false;
    }
    
    console.log('Admin authentication successful!');
    return true;
}

// Logout function
function logout() {
    console.log('Logging out...');
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
}

// Initialize admin panel
function initializeAdmin() {
    console.log('Initializing admin panel...');
    
    if (!checkAdminAuth()) {
        console.log('Authentication failed, stopping initialization');
        return;
    }
    
    console.log('Authentication passed, loading admin panel...');
    
    // Load initial data
    loadBookings();
    updateStats();
    setupEventListeners();
    loadSlotsOverview();
    
    // Auto-refresh slots overview every 30 seconds
    setInterval(() => {
        if (document.getElementById('slotsGrid')) {
            updateSlotsGrid();
        }
    }, 30000);
    
    console.log('Admin panel initialized successfully!');
}

// Global variables
let bookings = [];
let filteredBookings = [];
let currentCancelBooking = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel DOM loaded, initializing...');
    initializeAdmin();
});

// Load bookings from localStorage
function loadBookings() {
    console.log('Loading bookings from localStorage...');
    try {
        bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        filteredBookings = [...bookings];
        console.log('Bookings loaded:', bookings.length);
        displayBookings();
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookings = [];
        filteredBookings = [];
    }
}

// Load slots overview
function loadSlotsOverview() {
    console.log('Loading slots overview...');
    const overviewDate = document.getElementById('overviewDate');
    if (overviewDate) {
        overviewDate.value = new Date().toISOString().split('T')[0];
        overviewDate.addEventListener('change', updateSlotsGrid);
        updateSlotsGrid();
        console.log('Slots overview loaded');
    } else {
        console.error('overviewDate element not found');
    }
}

// Update slots grid
function updateSlotsGrid() {
    console.log('Updating slots grid...');
    const overviewDate = document.getElementById('overviewDate').value;
    const slotsGrid = document.getElementById('slotsGrid');
    
    if (!overviewDate) {
        console.log('No date selected for slots grid');
        return;
    }
    
    // Time slots from 9 AM to 10 PM (1-hour intervals in 12-hour format)
    const timeSlots = [
        '09:00 AM-10:00 AM', '10:00 AM-11:00 AM', '11:00 AM-12:00 PM', '12:00 PM-01:00 PM', '01:00 PM-02:00 PM', 
        '02:00 PM-03:00 PM', '03:00 PM-04:00 PM', '04:00 PM-05:00 PM', '05:00 PM-06:00 PM', '06:00 PM-07:00 PM', 
        '07:00 PM-08:00 PM', '08:00 PM-09:00 PM', '09:00 PM-10:00 PM'
    ];
    
    const dateBookings = bookings.filter(booking => 
        booking.date === overviewDate && booking.status !== 'cancelled'
    );
    
    console.log('Date bookings for', overviewDate, ':', dateBookings.length);
    
    slotsGrid.innerHTML = timeSlots.map(time => {
        const booking = dateBookings.find(b => b.time === time);
        
        // Only show available and booked slots (no past slots)
        
        if (booking) {
            // Calculate booking age
            const createdDate = new Date(booking.createdAt);
            const now = new Date();
            const ageInHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
            const ageInDays = Math.floor(ageInHours / 24);
            const ageText = ageInDays > 0 ? `${ageInDays}d ago` : `${ageInHours}h ago`;
            
            return `
                <div class="slot-item booked">
                    <div class="slot-time">${time}</div>
                    <div class="slot-info">
                        <div class="customer-name">${booking.name}</div>
                        <div class="customer-mobile">📱 ${booking.mobile}</div>
                        <div class="customer-email">📧 ${booking.email}</div>
                        <div class="booking-id">🆔 ${booking.id}</div>
                        <div class="booking-date">📅 ${formatDate(booking.date)}</div>
                        <div class="booking-age">⏰ ${ageText}</div>
                        <div class="booking-status ${booking.status}">${booking.status.toUpperCase()}</div>
                        <div class="payment-info">💳 ${booking.paymentMethod || 'UPI'} - ₹${booking.amount || 10}</div>
                        <div class="upi-info">🔗 varun173205@axl</div>
                    </div>
                    <div class="slot-actions">
                        <button onclick="viewBookingDetails('${booking.id}')" class="btn-view" title="View Full Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="cancelBooking('${booking.id}')" class="btn-cancel-slot" title="Cancel Booking">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="slot-item available">
                    <div class="slot-time">${time}</div>
                    <div class="slot-info">
                        <div class="status-text">Available</div>
                    </div>
                </div>
            `;
        }
    }).join('');
    
    console.log('Slots grid updated');
}

// Display bookings in the table
function displayBookings(bookingsToShow = filteredBookings) {
    console.log('Displaying bookings:', bookingsToShow.length);
    const bookingsContainer = document.getElementById('bookingsContainer');
    
    if (bookingsToShow.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <h3>No bookings found</h3>
                <p>There are no bookings matching your current filters.</p>
            </div>
        `;
        return;
    }
    
    bookingsContainer.innerHTML = bookingsToShow.map(booking => `
        <div class="booking-card ${booking.status}">
            <div class="booking-header">
                <div class="booking-id">${booking.id}</div>
                <div class="booking-status ${booking.status}">
                    <i class="fas fa-${booking.status === 'confirmed' ? 'check-circle' : 
                                     booking.status === 'pending' ? 'clock' : 'times-circle'}"></i>
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
            </div>
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <strong>Name:</strong> ${booking.name}
                    </div>
                    <div class="detail-item">
                        <strong>Mobile:</strong> ${booking.mobile}
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-item">
                        <strong>Email:</strong> ${booking.email}
                    </div>
                    <div class="detail-item">
                        <strong>Date:</strong> ${formatDate(booking.date)}
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-item">
                        <strong>Time:</strong> ${getTimeSlotText(booking.time)}
                    </div>
                    <div class="detail-item">
                        <strong>Amount:</strong> ₹10
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-item">
                        <strong>Booking Date:</strong> ${formatDate(booking.createdAt)}
                    </div>
                </div>
            </div>
            <div class="booking-actions">
                <a href="tel:${booking.mobile}" class="btn btn-primary">
                    <i class="fas fa-phone"></i> Call
                </a>
                <a href="mailto:${booking.email}" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i> Email
                </a>
                ${booking.status === 'pending' ? `
                    <button onclick="openConfirmModal('${booking.id}')" class="btn btn-success">
                        <i class="fas fa-check"></i> Confirm Payment
                    </button>
                ` : ''}
                ${booking.status === 'confirmed' ? `
                    <button onclick="cancelBooking('${booking.id}')" class="btn btn-danger">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    console.log('Bookings displayed successfully');
}

// View booking details
function viewBookingDetails(bookingId) {
    console.log('Viewing booking details for:', bookingId);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        console.error('Booking not found:', bookingId);
        return;
    }
    
    // Calculate booking age
    const createdDate = new Date(booking.createdAt);
    const now = new Date();
    const ageInHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
    const ageInDays = Math.floor(ageInHours / 24);
    
    const modal = document.getElementById('confirmModal');
    const bookingDetails = document.getElementById('bookingDetails');
    
    bookingDetails.innerHTML = `
        <div class="booking-details-modal">
            <div class="detail-section">
                <h4><i class="fas fa-id-card"></i> Booking Information</h4>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Status:</strong> <span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span></p>
                <p><strong>Created:</strong> ${createdDate.toLocaleString()}</p>
                <p><strong>Age:</strong> ${ageInDays > 0 ? ageInDays + ' days' : ageInHours + ' hours'} ago</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Customer Information</h4>
                <p><strong>Name:</strong> ${booking.name}</p>
                <p><strong>Mobile:</strong> ${booking.mobile}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-calendar-alt"></i> Session Details</h4>
                <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                <p><strong>Time Slot:</strong> ${booking.time}</p>
                <p><strong>Duration:</strong> 1 Hour</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-credit-card"></i> Payment Information</h4>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod || 'UPI'}</p>
                <p><strong>Amount:</strong> ₹${booking.amount || 10}</p>
                <p><strong>UPI ID:</strong> varun173205@axl</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Additional Information</h4>
                <p><strong>Studio:</strong> KKR Studios</p>
                <p><strong>Service:</strong> Photography & Videography</p>
                <p><strong>Rate:</strong> ₹10 per hour</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Filter event listeners
    const dateFilter = document.getElementById('dateFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    const clearFilters = document.getElementById('clearFilters');
    
    if (dateFilter) dateFilter.addEventListener('change', filterBookings);
    if (statusFilter) statusFilter.addEventListener('change', filterBookings);
    if (searchInput) searchInput.addEventListener('input', filterBookings);
    if (clearFilters) clearFilters.addEventListener('click', clearFilters);
    
    // Modal event listeners
    const confirmModal = document.getElementById('confirmModal');
    const cancelModal = document.getElementById('cancelModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeConfirmModal();
            closeCancelModal();
        });
    });
    
    if (confirmModal) {
        window.addEventListener('click', function(e) {
            if (e.target === confirmModal) {
                closeConfirmModal();
            }
        });
    }
    
    if (cancelModal) {
        window.addEventListener('click', function(e) {
            if (e.target === cancelModal) {
                closeCancelModal();
            }
        });
    }
    
    console.log('Event listeners setup complete');
}

// Update statistics
function updateStats() {
    console.log('Updating statistics...');
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    const totalElement = document.getElementById('totalBookings');
    const confirmedElement = document.getElementById('confirmedBookings');
    const pendingElement = document.getElementById('pendingBookings');
    const cancelledElement = document.getElementById('cancelledBookings');
    
    if (totalElement) totalElement.textContent = totalBookings;
    if (confirmedElement) confirmedElement.textContent = confirmedBookings;
    if (pendingElement) pendingElement.textContent = pendingBookings;
    if (cancelledElement) cancelledElement.textContent = cancelledBookings;
    
    console.log('Statistics updated:', { totalBookings, confirmedBookings, pendingBookings, cancelledBookings });
}

// Open confirm payment modal
function openConfirmModal(bookingId) {
    console.log('Opening confirm modal for booking:', bookingId);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        console.error('Booking not found for modal:', bookingId);
        return;
    }
    
    const timeObj = new Date(`2000-01-01T${booking.time}`);
    const displayTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    document.getElementById('bookingDetails').innerHTML = `
        <div class="booking-details-modal">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Mobile:</strong> ${booking.mobile}</p>
            <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p><strong>Time:</strong> ${displayTime}</p>
            <p><strong>Amount:</strong> ₹10</p>
        </div>
    `;
    
    document.getElementById('confirmModal').style.display = 'block';
    window.currentBookingId = bookingId;
}

// Close confirm modal
function closeConfirmModal() {
    console.log('Closing confirm modal');
    document.getElementById('confirmModal').style.display = 'none';
    window.currentBookingId = null;
}

// Confirm payment
function confirmPayment() {
    console.log('Confirming payment...');
    const bookingId = window.currentBookingId;
    const paymentStatus = document.querySelector('input[name="paymentStatus"]:checked').value;
    
    if (!bookingId) {
        console.error('No booking ID for payment confirmation');
        return;
    }
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
        console.error('Booking not found for payment confirmation:', bookingId);
        return;
    }
    
    if (paymentStatus === 'received') {
        bookings[bookingIndex].status = 'confirmed';
        bookings[bookingIndex].confirmedDate = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Refresh display
        loadBookings();
        updateStats();
        updateSlotsGrid();
        
        showNotification('Payment confirmed successfully!', 'success');
    } else {
        showNotification('Payment not received. Booking remains pending.', 'info');
    }
    
    closeConfirmModal();
}

// Cancel booking
function cancelBooking(bookingId) {
    console.log('Cancelling booking:', bookingId);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        console.error('Booking not found for cancellation:', bookingId);
        return;
    }
    
    currentCancelBooking = booking;
    
    const timeObj = new Date(`2000-01-01T${booking.time}`);
    const displayTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    document.getElementById('cancelBookingDetails').innerHTML = `
        <div class="booking-details-modal">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Mobile:</strong> ${booking.mobile}</p>
            <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p><strong>Time:</strong> ${displayTime}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
        </div>
    `;
    
    document.getElementById('cancelModal').style.display = 'block';
}

// Close cancel modal
function closeCancelModal() {
    console.log('Closing cancel modal');
    document.getElementById('cancelModal').style.display = 'none';
    document.getElementById('cancelReason').value = '';
    currentCancelBooking = null;
}

// Confirm cancel booking
function confirmCancelBooking() {
    console.log('Confirming booking cancellation...');
    if (!currentCancelBooking) {
        console.error('No booking to cancel');
        return;
    }
    
    const bookingIndex = bookings.findIndex(b => b.id === currentCancelBooking.id);
    if (bookingIndex === -1) {
        console.error('Booking not found for cancellation:', currentCancelBooking.id);
        return;
    }
    
    const cancelReason = document.getElementById('cancelReason').value;
    
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancelledDate = new Date().toISOString();
    if (cancelReason) {
        bookings[bookingIndex].cancelReason = cancelReason;
    }
    
    // Update localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Refresh display
    loadBookings();
    updateStats();
    updateSlotsGrid();
    
    showNotification('Booking cancelled successfully!', 'success');
    closeCancelModal();
}

// Show notification
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: #fff;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #17a2b8, #20c997)';
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Filter bookings
function filterBookings() {
    console.log('Filtering bookings...');
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    filteredBookings = bookings.filter(booking => {
        const matchesDate = !dateFilter || booking.date === dateFilter;
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        const matchesSearch = !searchInput || 
            booking.name.toLowerCase().includes(searchInput) ||
            booking.mobile.includes(searchInput) ||
            booking.email.toLowerCase().includes(searchInput);
        
        return matchesDate && matchesStatus && matchesSearch;
    });
    
    console.log('Filtered bookings:', filteredBookings.length);
    displayBookings();
}

// Clear filters
function clearFilters() {
    console.log('Clearing filters...');
    document.getElementById('dateFilter').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    filteredBookings = [...bookings];
    displayBookings();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get time slot text
function getTimeSlotText(time) {
    const timeObj = new Date(`2000-01-01T${time}`);
    const startTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const endTimeObj = new Date(timeObj.getTime() + 60 * 60 * 1000);
    const endTime = endTimeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    return `${startTime} - ${endTime}`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing admin panel...');
    initializeAdmin();
}); 