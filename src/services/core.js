import _axios from "@/services/instance";

class Core {
    get(url) {
        return _axios.get(url).catch((error) => Promise.reject(error))
    }

    post(url, body = {}, config) {
        return _axios.post(url, body, {
            ...config
        }).catch((error) => Promise.reject(error))
    }

    put(url, body = {}) {
        return _axios.put(url, body).catch((error) => Promise.reject(error))
    }

    delete(url) {
        return _axios.delete(url).catch((error) => Promise.reject(error))
    }
}

export default Core;