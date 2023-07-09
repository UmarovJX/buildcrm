import axios from "axios";
import {
  axiosResponseInterceptorError,
  axiosRequestInterceptResponse,
} from "@/util/axios-intercept";
import { isNull } from "@/util/inspect";

const instanceGenerator = ({ baseUrl, headers = {} }) => {
  const instance = axios.create({
    headers,
    baseURL: baseUrl,
  });

  instance.interceptors.request.use(axiosRequestInterceptResponse, (error) =>
    Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    axiosResponseInterceptorError
  );
  return instance;
};

export const axiosV1CRM = instanceGenerator({
  // eslint-disable-next-line no-undef
  baseUrl: process.env.VUE_APP_URL_V1_CRM,
});
export const axiosV2 = instanceGenerator({
  // eslint-disable-next-line no-undef
  baseUrl: process.env.VUE_APP_URL_V2,
});
// eslint-disable-next-line no-undef
export const axiosBase = ({ baseUrl = null, endpoint = "", headers = {} }) => {
  if (isNull(baseUrl)) {
    return instanceGenerator({
      headers,
      // eslint-disable-next-line no-undef
      baseUrl: process.env.VUE_APP_URL + endpoint,
    });
  }
  // eslint-disable-next-line no-undef
  return instanceGenerator({
    headers,
    baseUrl: baseUrl + endpoint,
  });
};
