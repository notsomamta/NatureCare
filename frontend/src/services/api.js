// src/services/api.js

const API_URL = 'http://localhost:3000/api';

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to register');
  }

  return response.json();
};
export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to login');
  }

  return response.json();
};

// src/services/api.js

// ... (keep your existing API_URL, registerUser, and loginUser functions) ...

export const getPlants = async (token) => {
  const response = await fetch(`${API_URL}/plants`, {
    headers: {
      'x-auth-token': token,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch plants');
  }
  return response.json();
};

export const addPlant = async (plantData, token) => {
  const response = await fetch(`${API_URL}/plants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(plantData),
  });
  if (!response.ok) {
    throw new Error('Failed to add plant');
  }
  return response.json();
};

// src/services/api.js

// ... (keep all your existing functions) ...

export const getReminders = async (token) => {
  const response = await fetch(`${API_URL}/reminders`, {
    headers: {
      'x-auth-token': token,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch reminders');
  }
  return response.json();
};

export const addReminder = async (reminderData, token) => {
  const response = await fetch(`${API_URL}/reminders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(reminderData),
  });
  if (!response.ok) {
    throw new Error('Failed to add reminder');
  }
  return response.json();
};

// src/services/api.js

// ... (keep all your existing functions: registerUser, loginUser, getPlants, addPlant, getReminders, addReminder) ...

export const uploadPlantImage = async (formData, token) => {
  // We send the request to our Node.js backend's upload route
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      // We don't set Content-Type; the browser does it for FormData
      'x-auth-token': token,
    },
    body: formData, // The body is the FormData object containing the file
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  return response.json();
};

// Add this to your existing exports in src/services/api.js
export const deletePlant = async (plantId, token) => {
  const response = await fetch(`${API_URL}/plants/${plantId}`, { // Changed from 5000 to API_URL
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || 'Failed to delete plant');
  }

  return await response.json();
};