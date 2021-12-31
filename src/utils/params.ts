/**
 * 处理发送前的params，在原始对象上修改，并返回该对象
 */
import * as json2md from 'json2md';
import { ActionParamsBuildTime, ApiErrorParams, ApiInfoActionParams, BuildTimeParams, ReportParams, SendParams } from '../interface/NvwaParams';
import { decryption } from './';

interface listType {
  name: string;
  value: string | number | null | undefined;
}

/**
 * 处理新旧API差异
 * @param {ApiErrorParams | ApiInfoActionParams} params 
 */
export const useApiInfo = (params: ApiErrorParams | ApiInfoActionParams) => {
  if (!params.apiInfo) {
    params.apiInfo = {
      request_method: params.requestMethod,
      request_path: params.requestPath,
      request_params: params.requestParams,
      response_content: params.responseContent,
      response_status_code: params.responseStatusCode
    }
  }
}

/**
 * 处理新旧API差异
 * @param {ActionParamsBuildTime & BuildTimeParams} params 
 */
export const useBuildTime = (params: ActionParamsBuildTime & BuildTimeParams) => {
  if (!params.other?.appName) {
    params.other = {
      app_name: params.appName,
      time: params.time,
      status: params.status,
      mode: params.mode
    }
  }
}

/**
 * 处理旧版的自定义字段，过滤无效字段
 * @param {ReportParams | BuildTimeParams} params
 */
export const useFilterMsg = (params: ReportParams | BuildTimeParams) => {
  if (!params.other) params.other = {};
  const { msg = [] } = params.other;
  if (!Array.isArray(msg)) params.other.msg = [];
  else params.other.msg = msg.filter((item) => item.name && item.value);
}

/**
 * 处理 user_agent
 * @param {SendParams} params
 */
export const useUA = (params: SendParams) => {
  if (!params.other) params.other = {};
  const { user_agent } = params.other || {};
  if (!user_agent && typeof navigator !== 'undefined') params.other.user_agent = navigator.userAgent || '';
}

/**
 * 处理 source_url
 * @param {SendParams} params
 */
export const useSourceUrl = (params: SendParams) => {
  if (!params.other) params.other = {};
  const { source_url } = params.other;
  if (!source_url && typeof window !== 'undefined') params.other.source_url = window.location.href || '';
}

/**
 * 处理 NoticeMsg
 * @param {SendParams} params
 */
export const useNoticeMsg = (params: SendParams): SendParams => {
  const list = params.noticeMsg;
  if (!list) return params;
  params.noticeMsg = json2md([
    {
      ul: list.map(
        ({ name, value }: listType): string =>
          `${name}：${value && value.toString().replace(/\n/g, '')}`
      ),
    },
  ]);
  return params;
};

/**
 * 处理 figui
 * @param {SendParams} params
 * @param {string} figui
 * @returns
 */
export const useFigui = (params: SendParams, figui: string): SendParams => {
  if (!figui) return params;
  params.uidStr = figui;
  return params;
};

/**
 * 处理上报的 UserId
 * @param params
 * @param figui 
 * @returns 
 */
export const useUserId = (params: SendParams, figui: string) => {
  if (figui && !params.uid) params.uid = decryption(figui);
  if (!params.uid) return;

  const logData = JSON.parse(params.logData);
  const listData = Array.isArray(logData) ? logData : logData.list;
  listData.splice(listData.length - 1, 0, {
    name: "用户ID",
    value: params.uid
  })
  
  // 同步修改 noticeMsg
  if (params.noticeMsg) params.noticeMsg.splice(params.noticeMsg.length - 1, 0, {
    name: "用户ID",
    value: params.uid
  })
  params.logData = JSON.stringify(logData)
}