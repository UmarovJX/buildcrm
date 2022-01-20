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
        return _axios.post(url, body,{
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        });
    }

    put(url, body = {}) {
        return _axios.put(url, body,{
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
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