import axios from 'axios';

// axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 中间件 拦截请求-
axios.interceptors.response.use(
  config => {
    if(config.headers['x-requested-log']){
      return 
    }
  },
  (err) => {}
);

const safeRequest = (options) => {
  return axios({
    ...options,
    headers: { 'x-requested-log': 'XMLHttpRequest-Log' },
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
