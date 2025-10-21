// Authentication utility functions for token management

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Save authentication data to localStorage
export const saveAuthData = (authData) => {
  try {
    // Handle different response formats
    const token = authData.token || authData.Token;
    const user = authData.user || authData.User;
    const userId = authData.user_id || authData.user_uuid;
    const expiresIn = authData.expires_in;
    const tokenType = authData.token_type || 'Bearer';

    if (!token) {
      console.error('No token found in auth data:', authData);
      return false;
    }

    // Calculate expiration time
    const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : null;

    // Prepare user data
    const userData = {
      id: user?.Id || userId,
      email: user?.Email,
      username: user?.Username,
      tokenType,
      expiresAt
    };

    // Save to localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    console.log('Auth data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
};

// Get token from localStorage
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get user data from localStorage
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Check if token is valid and not expired
export const isTokenValid = () => {
  try {
    const token = getToken();
    const userData = getUserData();
    
    if (!token || !userData) {
      return false;
    }

    // Check if token has expired
    if (userData.expiresAt && Date.now() > userData.expiresAt) {
      clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

// Clear authentication data from localStorage
export const clearAuthData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Get authorization header for API requests
export const getAuthHeader = () => {
  const token = getToken();
  const userData = getUserData();
  
  if (!token || !isTokenValid()) {
    return {};
  }

  const tokenType = userData?.tokenType || 'Bearer';
  return {
    'Authorization': `${tokenType} ${token}`
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return isTokenValid();
};
