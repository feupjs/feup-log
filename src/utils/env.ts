import { ApiType } from '../config/constants';

const typeMode: ApiType = {
  dev: 'dev',
  prod: 'prod',
  test: 'test',
};
type ModeType = 'dev' | 'prod' | 'test';

let mode: string = 'prod';

// 自定义上报接口环境
const initMode = (md: ModeType) => {
  mode = typeMode[md] || 'prod';
};

export { initMode, mode };
