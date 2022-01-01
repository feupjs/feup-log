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
  dev: 'https://nvwa-api.feup.cn',
  test: 'https://nvwa-api.feup.cn',
  pre: 'https://nvwa-api.feup.cn',
  prod: 'https://nvwa-api.feup.cn',
};

const nvwaOrigin: ApiType = {
  dev: 'https://nvwa-api.feup.cn',
  test: 'https://nvwa-api.feup.cn',
  pre: 'https://nvwa-api.feup.cn',
  prod: 'https://nvwa-api.feup.cn',
};

export { NAME_SPACE, AMAPI, kmsapi, NVWA_API, nvwaOrigin };
