import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

const contactService = {
  submitContactForm: async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BACKEND_API_URL}/api/contact`, 
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

export default contactService; 