import { AxiosResponse } from 'axios';
// 初始化参数
export interface InitParams {
  readonly app_id: string;
  readonly env: string;
  readonly debug?: boolean;
  readonly [path: string]: any;
}

export interface BaseParams {
  level: 'info' | 'warn' | 'debug' | 'error' | 'fatal';
  uid?: string | number;
  title?: string;
  content?: string;
  nvwaOrigin?: string;
  figId: string;
}

interface UserInfoParams {
  mobile?: string;
  openid?: string;
  uid?: string | number;
  unionid?: string;
  [params: string]: any;
}

export interface ApiInfoParams {
  request_method: string;
  request_path: string;
  request_params?: string;
  response_content?: string;
  response_status_code?: string | number;
  [params: string]: any;
}

interface Msg {
  name?: string;
  value?: string;
  [params: string]: any;
}

interface OptionalOtherParams {
  msg?: Array<Msg>;
  [params: string]: any;
}

interface ApiErrorOtherParams extends OptionalOtherParams {
  user_agent: string;
  source_url: string;
  version?: string;
}

type NoticeSend = boolean | number | undefined;

interface NoticeParams {
  send?: NoticeSend;
  title?: string;
  msg?: string;
}

// ApiError参数
export interface ApiErrorParams extends BaseParams {
  userInfo?: UserInfoParams;
  apiInfo?: ApiInfoParams;
  response?: AxiosResponse;
  other?: ApiErrorOtherParams;
  notice?: NoticeSend;
}

// NotMatch参数
export interface NotMatchParams extends BaseParams {
  userInfo?: UserInfoParams;
  apiInfo?: ApiInfoParams;
  other?: ApiErrorOtherParams;
  notice?: NoticeParams;
}

// Report参数
export interface ReportParams extends BaseParams {
  userInfo?: UserInfoParams;
  apiInfo?: ApiInfoParams;
  other?: OptionalOtherParams;
  notice?: NoticeParams;
}

// BuildTime参数
export interface BuildTimeParams extends BaseParams {
  userInfo?: UserInfoParams;
  apiInfo?: ApiInfoParams;
  other?: OptionalOtherParams;
  notice?: NoticeParams;
}

export interface Context {
  initOptions?: InitParams;
  options?: ApiErrorParams | NotMatchParams | ReportParams | BuildTimeParams;
}

export interface SendParams extends Object {
  uidStr?: string;
  [params: string]: any;
}
