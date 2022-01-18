import axios from "axios";

const _axios = axios.create({baseURL: process.env.VUE_APP_URL});

class Core {

    get(url, body = {}) {
        return _axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            },
            body
        });
    }

    post(url, body = {}) {
        return _axios.post(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            },
            body
        });
    }

    put(url, body = {}) {
        return _axios.put(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            },
            body
        });
    }

    delete(url, body = {}) {
        return _axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            },
            body
        });
    }
}

export default Core;