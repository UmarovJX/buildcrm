import axios from "axios";
import {
  axiosResponseInterceptorError,
  axiosRequestInterceptResponse,
} from "@/util/axios-intercept";

const instanceGenerator = (baseUrl) => {
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

// export const axiosBaseURL = instanceGenerator(process.env.VUE_APP_URL)
export const axiosV1CRM = instanceGenerator(process.env.VUE_APP_URL_V1_CRM);
export const axiosV2 = instanceGenerator(process.env.VUE_APP_URL_V2);
