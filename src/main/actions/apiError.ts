import * as dayjs from 'dayjs';
import UAParser from '../../utils/ua.js'
import {
  ApiErrorParams,
  Context,
  SendParams,
} from '../../interface/NvwaParams';
import { handleAxios } from '../../utils/axios';

const apiError = (options: ApiErrorParams, context: Context): SendParams => {
  const {
    title,
    content,
    level,
    apiInfo,
    response,
    notice,
    uid,
    other,
    nvwaOrigin,
    figId,
  } = options;
  const { app_id, env } = context.initOptions;
  const { user_agent, source_url, version, msg } = other || {};
  const {
    response_status_code,
    request_method,
    request_path,
    request_params,
    response_content,
  } = (response ? handleAxios(response) : apiInfo) || {};

  const UA = user_agent;
  const sourceUrl = source_url;
  const verfiyMsg = msg;
  
  const list = [
    { name: '时间', value: dayjs().format('YYYY-MM-DD HH:mm:ss') },
    { name: '应用名称', value: '{{APP_NAME}}' },
    { name: '环境', value: env },
    { name: '用户设备ID', value: figId },
    { name: '接口状态', value: response_status_code || 0 },
    { name: '请求方式', value: request_method },
    {
      name: '请求API',
      value: request_path,
    },
    { name: '请求参数', value: request_params },
    { name: '接口返回', value: response_content },
    {
      name: '设备环境',
      value: UAParser(UA),
    },
    {
      name: '来源地址',
      value: sourceUrl,
    },
    ...verfiyMsg,
    {
      name: '查看详情',
      value: `${nvwaOrigin}/log/{{LOG_ID}}`,
    },
  ];
  const params = {
    /**
     * 上报类型: notice,404,apiException,必填
     * 说明: notice-主动上报；404-notFound；apiException-接口异常
     */
    type: 'apiException',
    appId: app_id,
    clientVersion: version,
    env,
    level: level || 'error',
    logTitle: title || `{{APP_NAME}}_${env} 接口异常`,
    logData: content
      ? JSON.stringify({
          content,
          list,
        })
      : JSON.stringify(list),
    sourceUrl: sourceUrl,
    uid,
    userAgent: UA,
    isNotice: !!notice,
    noticeTitle: '接口异常通知!',
    noticeMsg: list,
    apiRequestInfo: apiInfo,
  };
  return params;
};

export default apiError;
