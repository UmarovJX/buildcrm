class Core {
  constructor(axios) {
    this._axios = axios;
  }

  get(url, config) {
    return this._axios.get(url, config).catch((error) => Promise.reject(error));
  }

  post(url, body = {}, config) {
    return this._axios
      .post(url, body, {
        ...config,
      })
      .catch((error) => Promise.reject(error));
  }

  put(url, body = {}) {
    return this._axios.put(url, body).catch((error) => Promise.reject(error));
  }

  delete(url) {
    return this._axios.delete(url).catch((error) => Promise.reject(error));
  }
}

export default Core;
