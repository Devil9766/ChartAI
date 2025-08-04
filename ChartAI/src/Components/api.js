import axios from "axios";


const api = axios.create({
    baseURL : "https://chartai-ebsm.onrender.com",
    withCredentials : true
})

export default api;