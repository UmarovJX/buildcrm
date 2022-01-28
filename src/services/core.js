import axios from "axios";

const _axios = axios.create({baseURL: process.env.VUE_APP_URL});

class Core {

    get(url, body = {}) {
        return _axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            },
            body
        }).catch((error) => Promise.reject(error))
    }

    post(url, body = {}, config) {
        return _axios.post(url, body, {
            ...config,
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).catch((error) => Promise.reject(error))
    }

    put(url, body = {}) {
        return _axios.put(url, body, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).catch((error) => Promise.reject(error))
    }

    delete(url, body = {}) {
        return _axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            },
            body
        }).catch((error) => Promise.reject(error))
    }
}

export default Core;