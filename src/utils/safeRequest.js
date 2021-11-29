import axios from 'axios';

// axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 中间件 拦截请求-
// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (err) => {}
// );

const safeRequest = (options) => {
  // console.log('请求所有参数', options);
  return axios({
    ...options,
    // headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
};

const get = function (options) {
  return safeRequest({
    ...options,
  });
};

const post = function (options) {
  return safeRequest({
    method: 'POST',
    ...options,
  });
};
export { get, post };
