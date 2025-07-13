// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin login page loaded');
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    // Admin credentials (in a real app, this would be server-side)
    const ADMIN_CREDENTIALS = {
        username: 'kirankiru18',
        password: 'kirankumar@kirankumar68686'
    };
    
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        console.log('Login attempt:', { username, password: password ? '***' : 'empty' });
        
        // Validate inputs
        if (!username || !password) {
            console.log('Validation failed: empty fields');
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Check credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            console.log('Login successful, storing session...');
            
            // Store admin session
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminLoginTime', Date.now().toString());
            
            console.log('Session stored, showing success message...');
            
            // Show success message
            showNotification('Login successful! Redirecting to admin panel...', 'success');
            
            // Redirect to admin panel after a short delay
            setTimeout(() => {
                console.log('Redirecting to admin.html...');
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            console.log('Login failed: invalid credentials');
            // Show error message
            showNotification('Invalid username or password. Please try again.', 'error');
            
            // Clear password field
            document.getElementById('password').value = '';
            
            // Add shake animation to form
            const loginCard = document.querySelector('.login-card');
            loginCard.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginCard.style.animation = '';
            }, 500);
        }
    });
    
    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Show notification function
    function showNotification(message, type = 'info') {
        console.log('Showing notification:', message, type);
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Add input focus effects
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add loading state to login button
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('click', function() {
        if (this.type === 'submit') {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            this.disabled = true;
            
            // Reset button after form submission
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Admin Panel';
                this.disabled = false;
            }, 2000);
        }
    });
    
    console.log('Admin login page initialization complete');
}); 