import { AxiosResponse } from 'axios';
import { ApiInfoParams } from '../interface/NvwaParams';

function html2Escape(sHtml: string) {
  return sHtml.replace(/[<>&"]/g, (c) => {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
  });
}

export const handleAxios = (res: AxiosResponse): ApiInfoParams | undefined => {
  if (Object.prototype.toString.call(res) !== '[object Object]') return;
  let apiResponse = '';
  if (res?.request?.responseType === 'json') {
    apiResponse = JSON.stringify(res?.request?.response);
  }
  if (
    res?.request?.responseType === 'text' ||
    res?.request?.responseType === ''
  ) {
    apiResponse = res?.request?.responseText;
  }

  return {
    response_status_code: res?.status || '',
    request_method: res?.config?.method || '',
    request_path: res?.config?.url || '',
    request_params: JSON.stringify(
      res?.config?.data || res?.config?.params || ''
    ),
    response_content: html2Escape(apiResponse),
  };
};
