import axios from 'axios';

// Update with your Flask server IP/domain
// For local development with Flask, use your computer's local network IP
// For example: 'http://192.168.1.100:5000/api'
const API_BASE_URL = 'http://10.0.2.2:5000/api'; // This works for Android emulator to reach localhost

export const fetchSongs = async (
  birthYear: number, 
  location: string, 
  childhoodStart: number = 5, 
  childhoodEnd: number = 15
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/songs`, {
      birthYear,
      location,
      childhoodStart,
      childhoodEnd
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error);
    throw error;
  }
};