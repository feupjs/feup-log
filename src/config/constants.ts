const NAME_SPACE: string = 'apm';

export interface ApiType {
  dev: string;
  test: string;
  pre?: string;
  prod: string;
}

const AMAPI: ApiType = {
  dev: '',
  test: '',
  prod: '',
};

const kmsapi: ApiType = {
  dev: 'xxx',
  test: 'xxx',
  prod: 'xx',
};

const NVWA_API: ApiType = {
  dev: 'http://nvwa-api.feup.cn',
  test: 'http://nvwa-api.feup.cn',
  pre: 'http://nvwa-api.feup.cn',
  prod: 'http://nvwa-api.feup.cn',
};

const nvwaOrigin: ApiType = {
  dev: 'http://nvwa-api.feup.cn',
  test: 'http://nvwa-api.feup.cn',
  pre: 'http://nvwa-api.feup.cn',
  prod: 'http://nvwa-api.feup.cn',
};

export { NAME_SPACE, AMAPI, kmsapi, NVWA_API, nvwaOrigin };
