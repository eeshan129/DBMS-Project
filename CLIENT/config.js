// Configuration for the Library Management System Frontend
const CONFIG = {
    // Dynamically choose backend API URL depending on environment
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://dbms-project-api.onrender.com/api' // Replace with your Render URL once deployed
};
