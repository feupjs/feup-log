import { post } from '../utils/safeRequest';
import { apiData } from '../utils/reportData';

const send = (params: object, env: string) => {
  return new Promise((resolve, reject) => {
    // http://yapi.kaikeba.com/project/2708/interface/api/38992
    post(apiData({ url: '/api/log', params, env }))
      .then((res: unknown) => {
        resolve(res);
      })
      .catch((...err) => {
        reject(err);
      });
  });
};

export default send;
