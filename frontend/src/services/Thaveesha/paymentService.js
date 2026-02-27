import axios from 'axios';

const API_URL = 'http://localhost:5001/api/payments';

const getToken = () => localStorage.getItem('token');

const paymentAPI = {
  // Process card payment
  processCardPayment: async (orderId, cardDetails) => {
    try {
      const response = await axios.post(`${API_URL}/process-card`, {
        orderId,
        ...cardDetails,
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Process cash on delivery
  processCashOnDelivery: async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/process-cod`, {
        orderId,
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment status by payment ID
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by order ID
  getPaymentByOrderId: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId) => {
    try {
      const response = await axios.post(`${API_URL}/${paymentId}/refund`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentAPI;
