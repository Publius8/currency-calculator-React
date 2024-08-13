import axios from 'axios';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};
