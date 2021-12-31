import * as dayjs from 'dayjs';
import UAParser from '../../utils/ua.js'
import { ReportParams, Context, SendParams } from '../../interface/NvwaParams';

const report = (options: ReportParams, context: Context): SendParams => {
  const { title, content, level, notice = true, uid, other, nvwaOrigin, figId } = options;
  const { app_id, env } = context.initOptions;
  const { user_agent, source_url, version, msg } = other || {};

  const UA = user_agent;
  const sourceUrl = source_url;
  const verfiyMsg = msg;

  let _content = typeof content === "object" ? JSON.stringify(content) : content;
  
  const list = [
    { name: '上报内容', value: _content },
    { name: '时间', value: dayjs().format('YYYY-MM-DD HH:mm:ss') },
    { name: '应用名称', value: '{{APP_NAME}}' },
    { name: '环境', value: env },
    { name: '用户设备ID', value: figId },
    {
      name: '设备环境',
      value: UAParser(UA),
    },
    {
      name: '页面地址',
      value: sourceUrl,
    },
    ...verfiyMsg,
    {
      name: '查看详情',
      value: `${nvwaOrigin}/log/{{LOG_ID}}`,
    }
  ];
  const params = {
    /**
     * 上报类型: notice,404,apiException,必填
     * 说明: notice-主动上报；404-notFound；apiException-接口异常
     */
    type: 'notice',
    appId: app_id,
    clientVersion: version,
    env,
    level: level || 'info',
    logTitle: title || `主动上报通知-{{APP_NAME}}_${env}`,
    logData: content
      ? JSON.stringify({
          content,
          list,
        })
      : JSON.stringify(list),
    sourceUrl,
    uid,
    userAgent: UA,
    isNotice: !!notice,
    noticeTitle: title || '主动上报通知',
    noticeMsg: list,
  };
  return params;
};

export default report;
