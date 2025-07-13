// Booking List JavaScript
let allBookings = [];
let filteredBookings = [];

// Initialize booking list
document.addEventListener('DOMContentLoaded', function() {
    loadBookings();
    updateStats();
});

// Load bookings from localStorage
function loadBookings() {
    allBookings = JSON.parse(localStorage.getItem('kkrBookings')) || [];
    
    // Sort by date (newest first)
    allBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    
    filteredBookings = [...allBookings];
    displayBookings();
}

// Display bookings
function displayBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    if (filteredBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-inbox"></i>
                <h3>No bookings found</h3>
                <p>No bookings match your current filters.</p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = filteredBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">${booking.bookingId}</div>
                <div class="booking-status ${booking.status}">${booking.status}</div>
            </div>
            <div class="booking-details">
                <div class="detail-item">
                    <div class="detail-label">Customer Name</div>
                    <div class="detail-value">${booking.name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mobile</div>
                    <div class="detail-value">${booking.mobile}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${booking.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Appointment Date</div>
                    <div class="detail-value">${formatDate(booking.date)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Time Slot</div>
                    <div class="detail-value">${getTimeSlotText(booking.time)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Payment Method</div>
                    <div class="detail-value">${getPaymentMethodText(booking.paymentMethod)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">₹10</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Booking Date</div>
                    <div class="detail-value">${formatDate(booking.bookingDate)}</div>
                </div>
                ${booking.confirmedDate ? `
                    <div class="detail-item">
                        <div class="detail-label">Confirmed Date</div>
                        <div class="detail-value">${formatDate(booking.confirmedDate)}</div>
                    </div>
                ` : ''}
                ${booking.autoConfirmed ? `
                    <div class="detail-item">
                        <div class="detail-label">Confirmation</div>
                        <div class="detail-value" style="color: #28a745;">
                            <i class="fas fa-robot"></i> Auto-Confirmed
                        </div>
                    </div>
                ` : ''}
            </div>
            ${booking.notes ? `
                <div class="detail-item">
                    <div class="detail-label">Notes</div>
                    <div class="detail-value">${booking.notes}</div>
                </div>
            ` : ''}
            <div class="booking-actions">
                <a href="tel:${booking.mobile}" class="btn btn-primary">
                    <i class="fas fa-phone"></i> Call Customer
                </a>
                <a href="mailto:${booking.email}" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i> Email Customer
                </a>
                ${booking.status === 'confirmed' ? `
                    <button onclick="cancelBooking('${booking.bookingId}')" class="btn btn-danger">
                        <i class="fas fa-times"></i> Cancel Booking
                    </button>
                    <div class="confirmed-badge">
                        <i class="fas fa-check-circle"></i> Payment Confirmed
                        ${booking.autoConfirmed ? ' (Auto)' : ''}
                    </div>
                ` : ''}
                ${booking.status === 'cancelled' ? `
                    <div class="cancelled-badge">
                        <i class="fas fa-times-circle"></i> Cancelled
                        ${booking.cancelledAt ? ` on ${formatDate(booking.cancelledAt)}` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const totalBookings = allBookings.length;
    const todayBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const today = new Date();
        return bookingDate.toDateString() === today.toDateString();
    }).length;
    
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('todayBookings').textContent = todayBookings;
}

// Filter bookings
function filterBookings() {
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredBookings = allBookings.filter(booking => {
        let matchesDate = true;
        let matchesStatus = true;
        
        // Date filter
        if (dateFilter) {
            const bookingDate = new Date(booking.date);
            const filterDate = new Date(dateFilter);
            matchesDate = bookingDate.toDateString() === filterDate.toDateString();
        }
        
        // Status filter
        if (statusFilter !== 'all') {
            matchesStatus = booking.status === statusFilter;
        }
        
        return matchesDate && matchesStatus;
    });
    
    displayBookings();
}

// Clear filters
function clearFilters() {
    document.getElementById('dateFilter').value = '';
    document.getElementById('statusFilter').value = 'all';
    filteredBookings = [...allBookings];
    displayBookings();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getTimeSlotText(time) {
    const timeSlots = {
        '09:00': '9:00 AM - 10:00 AM',
        '10:00': '10:00 AM - 11:00 AM',
        '11:00': '11:00 AM - 12:00 PM',
        '12:00': '12:00 PM - 1:00 PM',
        '13:00': '1:00 PM - 2:00 PM',
        '14:00': '2:00 PM - 3:00 PM',
        '15:00': '3:00 PM - 4:00 PM',
        '16:00': '4:00 PM - 5:00 PM',
        '17:00': '5:00 PM - 6:00 PM',
        '18:00': '6:00 PM - 7:00 PM',
        '19:00': '7:00 PM - 8:00 PM',
        '20:00': '8:00 PM - 9:00 PM',
        '21:00': '9:00 PM - 10:00 PM'
    };
    return timeSlots[time] || time;
}

function getPaymentMethodText(method) {
    return 'UPI Payment';
}

// Cancel booking function
function cancelBooking(bookingId) {
    const booking = allBookings.find(b => b.bookingId === bookingId);
    if (!booking) {
        alert('Booking not found');
        return;
    }
    
    // Check if cancellation is allowed (10 minutes before booking time)
    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
    const currentTime = new Date();
    const timeDifference = bookingDateTime.getTime() - currentTime.getTime();
    const minutesDifference = timeDifference / (1000 * 60);
    
    if (minutesDifference < 10) {
        alert('Cancellation is only allowed up to 10 minutes before the scheduled time. This booking cannot be cancelled now.');
        return;
    }
    
    if (confirm(`Are you sure you want to cancel the booking for ${booking.name} on ${formatDate(booking.date)} at ${getTimeSlotText(booking.time)}?`)) {
        try {
            const existingBookings = JSON.parse(localStorage.getItem('kkrBookings')) || [];
            const updatedBookings = existingBookings.map(b => {
                if (b.bookingId === bookingId) {
                    return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
                }
                return b;
            });
            
            localStorage.setItem('kkrBookings', JSON.stringify(updatedBookings));
            
            // Reload bookings
            loadBookings();
            updateStats();
            
            alert('Booking cancelled successfully!');
            
        } catch (error) {
            alert('An error occurred while cancelling the booking. Please try again.');
        }
    }
}

// Auto-refresh bookings every 30 seconds
setInterval(() => {
    loadBookings();
    updateStats();
}, 30000); 