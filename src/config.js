const API_BASE_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://calc-server-hgvf.onrender.com' // Production server URL
        : 'http://localhost:5000'; // Local development server URL

export default API_BASE_URL;
