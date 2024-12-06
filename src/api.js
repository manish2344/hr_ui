// api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Login API: Authenticates user and stores the token in localStorage
export const loginUserAPI = async ({ email, password }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token } = response.data;  // Assuming the token is returned in the response
        
        if (token) {
            // Store the token in localStorage
            localStorage.setItem('token', token);
        } else {
            throw new Error('Login failed. Token not received.');
        }

        return response.data;  // Returns the full response, including token
    } catch (error) {
        console.error('Login failed', error);
        throw error;  // Re-throw the error to be handled in the component
    }
};

// Register API: Registers a new user
export const registerUserAPI = async ({ name, email, password }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error('Registration failed', error);
        throw error;  // Re-throw the error to be handled in the component
    }
};

// Auction API: Fetches auction data by ID
export const getAuction = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/auction/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch auction', error);
        throw error;
    }
};

// Place Bid API: Places a bid in an auction, with token authentication
export const placeBidAPI = async (auctionId, bidAmount) => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    if (!token) {
        throw new Error("Token not found. Please login.");
    }

    try {
        const response = await axios.post(
            `${API_URL}/auction/${auctionId}/bid`,
            { amount: bidAmount },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Attach token in request headers
                },
            }
        );
        return response.data;  // Return the response data
    } catch (error) {
        console.error('Failed to place bid', error);
        throw error;  // Handle the error
    }
};

// Axios global configuration: Automatically add the token to every request header
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    if (token) {
        // Add token to Authorization header
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;  // Proceed with the request
}, (error) => {
    return Promise.reject(error);  // Handle any request errors
});

// Logout API: Removes the token from localStorage when the user logs out
export const logoutUser = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
};
