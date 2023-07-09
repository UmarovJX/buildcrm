import axios from "axios";
import {
  axiosResponseInterceptorError,
  axiosRequestInterceptResponse,
} from "@/util/axios-intercept";
import { isNull } from "@/util/inspect";

const instanceGenerator = (baseUrl) => {
  console.log(baseUrl);
  const instance = axios.create({
    baseURL: baseUrl,
  });

  console.log(instance);

  instance.interceptors.request.use(axiosRequestInterceptResponse, (error) =>
    Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    axiosResponseInterceptorError
  );
  return instance;
};

// eslint-disable-next-line no-undef
export const axiosV1CRM = instanceGenerator(process.env.VUE_APP_URL_V1_CRM);
// eslint-disable-next-line no-undef
export const axiosV2 = instanceGenerator(process.env.VUE_APP_URL_V2);
// eslint-disable-next-line no-undef
export const axiosBase = ({ baseUrl = null, endpoint = "" }) => {
  if (isNull(baseUrl)) {
    // eslint-disable-next-line no-undef
    return instanceGenerator(process.env.VUE_APP_URL + endpoint);
  }
  // eslint-disable-next-line no-undef
  return instanceGenerator(baseUrl + endpoint);
};
