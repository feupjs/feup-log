import * as dayjs from 'dayjs';
import {
  BuildTimeParams,
  Context,
  SendParams,
} from '../../interface/NvwaParams';

const buildTime = (options: BuildTimeParams, context: Context): SendParams => {
  const { title, content, level, notice, uid, other, nvwaOrigin, figId } =
    options;
  const { app_id, env } = context.initOptions;
  const { app_name, time, version, status, msg, mode } = other || {};
  const verfiyMsg = (msg || []).filter((item) => item.name && item.value);
  const list = [
    { name: '时间', value: dayjs().format('YYYY-MM-DD HH:mm:ss') },
    { name: '应用名称', value: app_name },
    { name: '环境', value: env },
    { name: '用户设备ID', value: figId },
    { name: '类型', value: mode },
    { name: '状态', value: status ? '成功' : '失败' },
    {
      name: '打包时长',
      value: `${time} s`,
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
    type: 'notice',
    appId: app_id,
    clientVersion: version,
    env,
    level: level || 'info',
    logTitle:
      title || `${app_name} 构建 ${env} 环境 ${status ? '成功' : '失败'}`,
    logData: content
      ? JSON.stringify({
          content,
          list,
        })
      : JSON.stringify(list),
    uid,
    isNotice: !!notice,
    noticeTitle: `${app_name}构建${env}环境`,
    noticeMsg: list,
  };
  return params;
};

export default buildTime;
