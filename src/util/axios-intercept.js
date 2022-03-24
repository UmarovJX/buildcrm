import axios from "axios";
import api from "@/services/api";
import {
    getLocalVar,
    removeLocalVar,
    setLocalVar,
} from "@/util/localstorage-helper";

function navigateToLoginPage() {
    removeLocalVar('auth__access__token')
    removeLocalVar('auth__refresh__token')
    if (window.location.pathname !== '/login')
        window.location.href = '/login'
}

async function retryApiCall(config) {
    const access_token = getLocalVar('auth__access__token')
    const _axios = axios.create({
        baseURL: config.baseURL,
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    // console.log('data', JSON.parse(config.data))
    const data = () => {
        if (config.data)
            return JSON.parse(config.data)
        return config.data
    }
    return await _axios({
        method: config.method,
        url: config.url,
        data: data()
    })
        .then((response) => response)
        .catch(error => Promise.reject(error))
}

async function waitApiCall(config) {
    return await new Promise((resolve) => {
        const starter = setInterval(() => {
            const pending = sessionStorage.getItem('pending')
            if (!parseInt(pending)) {
                resolve()
                clearInterval(starter)
            }
        }, 50)
    }).then(async () => await retryApiCall(config))
}

async function refreshToken() {
    const refreshToken = getLocalVar('auth__refresh__token')
    if (refreshToken) {
        const expiredIn = parseFloat(getLocalVar('expired_in'))
        const current = (new Date()).getTime()
        if (!expiredIn || expiredIn < current) {
            sessionStorage.setItem('pending', '1')
            return await api.auth.refreshToken(refreshToken)
                .then(async (response) => {
                    const {refresh_token, access_token, expires_in} = await response.data
                    const expiredTime = (new Date()).getTime() + parseFloat(expires_in) * 1000
                    setLocalVar('expired_in', `${expiredTime}`)
                    setLocalVar('auth__refresh__token', refresh_token)
                    setLocalVar('auth__access__token', access_token)
                    return 1
                })
                .catch(() => 1)
                .finally(() => {
                    sessionStorage.setItem('pending', '0')
                    return 1
                })
        } else {
            return 1
        }
    } else {
        navigateToLoginPage()
        return 0
    }
}

export function axiosRequestInterceptResponse(config) {
    const access_token = getLocalVar('auth__access__token')
    const requestConfig = Object.assign({}, config)
    if (!config.headers['Authorization'] && config.url !== 'oauth/login') {
        requestConfig.headers['Authorization'] = `Bearer ${access_token}`
    }
    return requestConfig
}

export async function axiosResponseInterceptorError(error) {
    if (error.response) {
        const {status} = error.response;
        switch (status) {
            case 401:
                if (error.config.url === 'oauth/login') {
                    const data = JSON.parse(error.config.data)
                    const hasRefreshToken = data.hasOwnProperty('refresh_token')
                    if (hasRefreshToken) {
                        navigateToLoginPage()
                    }
                } else {
                    const pending = sessionStorage.getItem('pending')
                    if (parseInt(pending)) {
                        return await waitApiCall(error.config)
                    } else {
                        const response = await refreshToken()
                        if (response) {
                            return await retryApiCall(error.config)
                        }
                    }
                }
                return Promise.reject(error)
            default:
                return Promise.reject(error)
        }
    }

    return Promise.reject(error)
}