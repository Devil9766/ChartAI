import axios from "axios";

const api = axios.create({
    baseURL : "https://chartai-1sd0.onrender.com",
    withCredentials : true
})

export default api;

