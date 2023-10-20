import axios from "axios";
// 创建axios实例
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ADDR,
  timeout: 20000,
  validateStatus: () => true,
});
instance.defaults.withCredentials=true;
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
export default instance;