/**
 * 处理发送前的params，在原始对象上修改，并返回该对象
 */
import * as json2md from 'json2md';
import { SendParams } from '../interface/NvwaParams';

interface listType {
  name: string;
  value: string | number | null | undefined;
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
