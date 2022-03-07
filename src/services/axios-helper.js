import axios from "@/services/instance";
import { decrypt, storeExpiry, read } from '@/util/localstorage-helper'

// set initial default from localstorage
axios.defaults.headers.common["Authorization"] = "Bearer " +  decrypt(read("auth_token"));

// helper method to refresh token
async function refreshToken() {
    // place request to backend service to refresh token
    const response = await axios.put("/api/auth/refresh-token");
    // update stored instance
    storeExpiry("auth_token", response.data.token, true);
    // update axios instance with new token
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
}

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        console.log(`${config.method.toUpperCase()} Request made to ${config.url} with data:`, config.data);
        return config;
    },
    function (err) {
        console.log(err);
        return err;
    });

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        const { status, data, config } = response;
        console.log(`Response from ${config.url}:`, {
            code: status,
            ...data,
        });
        return response;
    },
    async function (error) {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // check if 401 error was token
                    if (data.message === "An unauthenticated request was made, Please try again") {
                        // token has expired;
                        try {
                            // attempting to refresh token;
                            await refreshToken();
                            // token refreshed, reattempting request;
                            const config = error.config;
                            // configure new request in a new instance;
                            return await axios({method: config.method, url: config.url, data: config.data});
                        } catch (e) {
                            // console.log(e);
                            return window.location.href = "/error-page";
                        }
                    } else {
                        return window.location.href = "/error-page";
                    }
                default:
                    return Promise.reject(error);
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            return Promise.reject(error);
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject(error);
        }
    }
);