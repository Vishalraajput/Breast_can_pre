// // import axios from "axios";
// // const baseURL =  "http://localhost:5000";
// // const api = axios.create({ baseURL, withCredentials: true });
// // export default api;
// // src/api/api.js - AFTER
// import axios from "axios";

// // Create the instance
// const api = axios.create({
//   baseURL: "http://localhost:5000", // Or your server URL
// });

// // Use an interceptor to add the token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Add the token to the Authorization header
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from 'axios';

// Create a central instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// This function runs before every request.
// It checks for a token and adds it to the request headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;