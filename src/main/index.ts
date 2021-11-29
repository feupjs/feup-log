import { InitParams, Context, BaseParams } from '../interface/NvwaParams';
import actions from './actions';
import send from '../utils/send';
import { nvwaOrigin } from '../config/constants';
import { getDeviceID } from '../utils/crypto';
import { kkbCookie } from '../utils/cookie';
import { filterParams } from '../utils/filter';
import { useNoticeMsg, useFigui } from '../utils/params';

// 默认参数
const context: Context = { options: null };

export const init = ({ app_id, env, debug }: InitParams) => {
  if (!context.initOptions) {
    context.initOptions = { app_id, env, debug };
  }
};

type logType = 'apiError' | 'noMatch' | 'buildTime' | 'other';

export const report = ({
  type,
  level,
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
    const envPrefix = env === 'prod' ? '' : `${env}_`;
    let figui = kkbCookie.get(`${envPrefix}figui`);
    let figId = kkbCookie.get(`${envPrefix}figId`);
    if (!figId) {
      figId = getDeviceID();
      kkbCookie.set(`${envPrefix}figId`, figId, new Date(9999, 11, 31));
    }
    const fn = actions[type];
    const params = fn(
      { level, nvwaOrigin: nvwaOrigin[serverEnv], figId, ...props },
      context
    );
    useFigui(params, figui);
    useNoticeMsg(params);
    send(filterParams(params), serverEnv)
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
