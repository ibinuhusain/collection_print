import axios from 'axios';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'https://aquamarine-mule-238491.hostingersite.com/api/',
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle specific error responses
    if (error.response?.status === 401) {
      // Token might be expired, clear stored credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login (this would be handled by the calling component)
    }
    
    return Promise.reject(error);
  }
);

// API methods
const api = {
  // Authentication
  login: async (username, password) => {
    try {
      const response = await apiClient.post('login.php', {
        username,
        password
      });
      return response;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },

  // Assignments
  getAssignments: async () => {
    try {
      const response = await apiClient.get('assignments.php');
      return response;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },

  getAssignment: async (id) => {
    try {
      const response = await apiClient.get(`assignment.php?id=${id}`);
      return response;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },

  // Payments
  collectPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('payment.php', paymentData);
      return response;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  },

  // Printer operations (these would be handled differently in a real implementation)
  connectPrinter: async (config) => {
    // This would typically involve native code in a mobile app
    // For web, we'll return a simulated response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Connected to ${config.type} printer` });
      }, 500);
    });
  },

  printReceipt: async (receiptData) => {
    // This would typically involve native code in a mobile app
    // For web, we'll return a simulated response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Receipt printed successfully' });
      }, 1000);
    });
  },

  disconnectPrinter: async () => {
    // This would typically involve native code in a mobile app
    // For web, we'll return a simulated response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Printer disconnected successfully' });
      }, 500);
    });
  }
};

export default api;