import { NVWA_API } from '../config/constants';
// import { aesEncode } from './index';

const handlePostData = (url: string, params: object) => {
  return {
    url: `${url}`,
    data: params,
    headers: {
      // figdata: aesEncode(JSON.stringify(params)),
    },
  };
};


const apiData = ({
  url,
  params,
  env,
}: {
  url: string;
  params: object;
  env: string;
}) => {
  return handlePostData(`${NVWA_API[env] || NVWA_API['dev']}${url}`, params);
};

export {  apiData };
