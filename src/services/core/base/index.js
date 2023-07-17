import axios from "axios";
import {
  axiosResponseInterceptorError,
  axiosRequestInterceptResponse,
} from "@/util/axios-intercept";
import { isNull } from "@/util/inspect";

const instanceGenerator = ({ baseUrl }) => {
  const instance = axios.create({
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
export const axiosBase = ({ baseUrl = null, endpoint = "" }) => {
  if (isNull(baseUrl)) {
    return instanceGenerator({
      // eslint-disable-next-line no-undef
      baseUrl: process.env.VUE_APP_URL + endpoint,
    });
  }
  // eslint-disable-next-line no-undef
  return instanceGenerator({
    baseUrl: baseUrl + endpoint,
  });
};
