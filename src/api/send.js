import { post } from '../utils/request';
import { AMAPI } from '../config/constants';
import { aesEncode } from '../utils/index';

let mode = 'prod';

const initMode = (md) => {
  mode = md;
};

const postApiWarn = (params) => {
  return new Promise((resolve, reject) => {
    let data = {
      url: `${AMAPI[mode]}/apilog`,
      data: {},
      headers: {
        Authorization: aesEncode(JSON.stringify(params)),
      },
    };
    post(data)
      .then((res) => {
        resolve(res);
      })
      .catch(() => {
        reject();
      });
  });
};
const requestTime = (params) => {
  return new Promise((resolve, reject) => {
    let data = {
      url: `${AMAPI[mode]}/apitime`,
      data: {},
      headers: {
        Authorization: aesEncode(JSON.stringify(params)),
      },
    };
    post(data)
      .then((res) => {
        resolve(res);
      })
      .catch(() => {
        reject();
      });
  });
};

export { initMode, postApiWarn, requestTime };
