const NAME_SPACE: string = 'apm';

export interface ApiType {
  dev: string;
  test: string;
  pre?: string;
  prod: string;
}

const AMAPI: ApiType = {
  dev: 'https://xxx.xxx.com/v1',
  test: 'https://xxx.xxx.com/v1',
  prod: 'https://xxx.xxx.com/v1',
};

const kmsapi: ApiType = {
  dev: 'https://xxx.xxx.com/v1',
  test: 'https://xxx.xxx.com/v1',
  prod: 'https://xxx.xxx.com/v1',
};

const KMOSAPI: ApiType = {
  dev: 'https://xxx-dev.xxx.com',
  test: 'https://xxx-test.xxx.com',
  pre: 'https://xxx-pre.xxx.com',
  prod: 'https://xxx.xxx.com',
};

const nvwaOrigin: ApiType = {
  dev: 'https://devxxx.xxx.com',
  test: 'https://testxxx.xxx.com',
  pre: 'https://prexxx.xxx.com',
  prod: 'https://xxx.xxx.com',
};

export { NAME_SPACE, AMAPI, kmsapi, KMOSAPI, nvwaOrigin };
