import { InitParams, Context, BaseParams, ActionParamsApi, ActionParamsBuildTime } from '../interface/NvwaParams';
import actions from './actions';
import send from '../utils/send';
import { nvwaOrigin } from '../config/constants';
import { getDeviceID } from '../utils/crypto';
import { feupCookie } from '../utils/cookie';
import { filterParams } from '../utils/filter';
import { useNoticeMsg, useFigui, useUserId, useUA, useSourceUrl, useFilterMsg, useApiInfo, useBuildTime } from '../utils/params';
import XMLHttpRequestProxy from '../middleware/xhr';

// 默认参数
const context: Context = { options: null };

export const init = ({ app_id, env, debug, xhrProxy = true, xhrProxyNotice = true }: InitParams) => {
  if (xhrProxy) XMLHttpRequestProxy({ xhrProxy }, (apiInfo) => report({
    type: 'apiError',
    level: xhrProxyNotice ? 'error' : 'info',
    // @ts-ignore
    notice: false,
    title: 'xhr代理自动上报',
    content: '接口异常',
    apiInfo
  }));
  if (!context.initOptions) {
    context.initOptions = { app_id, env, debug, xhrProxy, xhrProxyNotice };
  }
};

type logType = 'apiError' | 'apiInfo' | 'noMatch' | 'buildTime' | 'other' | 'report';

export const apiError = (props: ActionParamsApi) => {
  useApiInfo(props);

  // @ts-ignore
  report({
    type: "apiError",
    ...props
  })
}

export const apiInfo = (props: ActionParamsApi) => {
  useApiInfo(props);

  // @ts-ignore
  report({
    type: "apiInfo",
    ...props
  })
}

export const noMatch = (props: BaseParams) => {
  // @ts-ignore
  report({
    type: "noMatch",
    ...props
  })
}

export const buildTime = (props: ActionParamsBuildTime) => {
  useBuildTime(props);

  // @ts-ignore
  report({
    type: "buildTime",
    ...props
  })
}

export const report = ({
  type = "report",
  ...props
}: {
  type: logType;
  level: BaseParams['level'];
  props: Context['options'][];
}) => {
  return new Promise((resolve, reject) => {
    const { env, debug } = context.initOptions;
    // 域名env相关
    const serverEnv = debug ? env : 'prod';

    // env前缀相关。
    let figui = feupCookie.getFigui(env);
    let figId = feupCookie.getFigId(env, getDeviceID);

    let params = { nvwaOrigin: nvwaOrigin[serverEnv], figId, ...props };
    
    useUA(params);
    useSourceUrl(params);
    useFilterMsg(params);

    const action = actions[type];
    // @ts-ignore
    const reportParams = action(params, context);
    
    useFigui(reportParams, figui);
    useUserId(reportParams, figui);
    useNoticeMsg(reportParams);
    
    send(filterParams(reportParams), serverEnv)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const Log = { init, report };

export default Log;
