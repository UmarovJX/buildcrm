import axios from "axios";

const instance = axios.create({
    baseURL: process.env.VUE_APP_URL,
    headers: {
        'Authorization': 'Bearer ' + localStorage.token
    }
})

export default instance