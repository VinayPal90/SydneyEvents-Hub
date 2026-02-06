// Vite mein environment variables import karne ka sahi tarika
// Agar VITE_API_URL nahi milta, toh ye fallback use karega
export const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://sydneyevents-hub-backend.onrender.com';
