import { AMAPI, kmsapi, KMOSAPI } from '../config/constants';
// import { aesEncode } from './index';
import { mode } from './env';

const handlePostData = (url: string, params: object) => {
  return {
    url: `${url}`,
    data: params,
    headers: {
      // figdata: aesEncode(JSON.stringify(params)),
    },
  };
};

/**
 * kmsapi环境数据
 */
const kmsapiData = (url: string, params: object) => {
  return handlePostData(`${kmsapi[mode]}${url}`, params);
};

/**
 * apitool环境数据
 */
const amapiData = (url: string, params: object) => {
  return handlePostData(`${AMAPI[mode]}${url}`, params);
};

const kmosapiData = ({
  url,
  params,
  env,
}: {
  url: string;
  params: object;
  env: string;
}) => {
  return handlePostData(`${KMOSAPI[env] || KMOSAPI['dev']}${url}`, params);
};

export { kmsapiData, amapiData, kmosapiData };
