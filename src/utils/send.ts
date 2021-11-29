import { post } from '../utils/safeRequest';
import { kmosapiData } from '../utils/reportData';

const send = (params: object, env: string) => {
  return new Promise((resolve, reject) => {
    post(kmosapiData({ url: '/nvwa-log-api/log', params, env }))
      .then((res: unknown) => {
        resolve(res);
      })
      .catch((...err) => {
        reject(err);
      });
  });
};

export default send;
