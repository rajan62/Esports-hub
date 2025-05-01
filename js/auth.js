// Authentication functions
const API_URL = 'http://localhost:3000';

// Store token in localStorage
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is logged in
const isLoggedIn = () => {
    return !!getToken();
};

// Register user
const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            setToken(data.token);
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'An error occurred during registration' };
    }
};

// Login user
const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        
        if (response.ok) {
            setToken(data.token);
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An error occurred during login' };
    }
};

const logout = async () => {
    try {
        const token = getToken();
        if (token) {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        removeToken();
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'An error occurred during logout' };
    }
};

const getProfile = async () => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Not authenticated' };
        }

        const response = await fetch(`${API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, user: data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Profile error:', error);
        return { success: false, message: 'An error occurred while fetching profile' };
    }
};

const updateAuthUI = () => {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const loginLi = Array.from(navLinks.children).find(li => 
        li.querySelector('a')?.textContent.toLowerCase() === 'login' ||
        li.querySelector('a')?.textContent.toLowerCase() === 'profile'
    );

    if (!isLoggedIn()) {
        if (!loginLi || loginLi.querySelector('a')?.textContent.toLowerCase() === 'profile') {
            const newLoginLi = document.createElement('li');
            newLoginLi.className = 'login-btn';
            newLoginLi.innerHTML = '<a href="login.html">Login</a>';
            
            if (loginLi) {
                loginLi.parentNode.replaceChild(newLoginLi, loginLi);
            } else {
                navLinks.appendChild(newLoginLi);
            }
        }
    } else {
        
    }
};

async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        
        // Update profile page elements if they exist
        const usernameElement = document.getElementById('username');
        const emailElement = document.getElementById('email');
        const registrationDateElement = document.getElementById('registrationDate');

        if (usernameElement) usernameElement.textContent = userData.name;
        if (emailElement) emailElement.textContent = userData.email;
        if (registrationDateElement) {
            const date = new Date(userData.createdAt);
            registrationDateElement.textContent = `Member since: ${date.toLocaleDateString()}`;
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile information. Please try logging in again.');
        window.location.href = 'login.html';
    }
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    // Fetch user profile if on profile page
    if (window.location.pathname.includes('profile.html')) {
        fetchUserProfile();
    }
    
    // Handle logout button click
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const result = await logout();
            if (result.success) {
                updateAuthUI(); // Update UI after successful logout
                window.location.href = 'index.html';
            } else {
                alert(result.message);
            }
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = await login({ email, password });
            
            if (result.success) {
                updateAuthUI(); 
                window.location.href = 'index.html';
            } else {
                alert(result.message);
            }
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            const result = await register({ name, email, password });
            
            if (result.success) {
                updateAuthUI(); 
                window.location.href = 'index.html';
            } else {
                alert(result.message);
            }
        });
    }
}); 