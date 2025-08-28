import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
})

export default api;

// https://chartai-1sd0.onrender.com