class Core {
  constructor(axios, config = {}) {
    this._axios = axios
    this._config = config
  }

  get(url, config = this._config) {
    return this._axios.get(url, config).catch(error => Promise.reject(error))
  }

  post(url, body = {}, config = this._config) {
    return this._axios
      .post(url, body, {
        ...config,
      })
      .catch(error => Promise.reject(error))
  }

  put(url, body = {}, config = this._config) {
    return this._axios
      .put(url, body, config)
      .catch(error => Promise.reject(error))
  }

  delete(url, config = this._config) {
    return this._axios
      .delete(url, config)
      .catch(error => Promise.reject(error))
  }
}

export default Core
