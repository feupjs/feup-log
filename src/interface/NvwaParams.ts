import { AxiosResponse } from 'axios';

export interface XhrProxyParam {
  readonly xhrProxy?: boolean | {
    domain: string[]
    notice: boolean
  };
  readonly xhrProxyNotice?: boolean;
}

// 初始化参数
export interface InitParams extends XhrProxyParam {
  readonly app_id: string;
  readonly env: string;
  readonly debug?: boolean;
}

/** 用户自定义消息，最终会拼接到钉钉的消息中 */
type CustomMsg = { title: string, value: unknown }[]

export interface BaseParams {
  level?: 'info' | 'warn' | 'debug' | 'error' | 'fatal';
  uid?: string | number;
  title?: string;
  content?: string;
  nvwaOrigin?: string;
  figId?: string;
  // 是否上报钉钉群
  notice?: NoticeParams;
  customMsg?: CustomMsg;
  version?: string;
}

// 新 API 类型声明
export interface ActionParamsApi extends BaseParams {
  requestMethod: string;
  requestPath: string;
  requestParams?: string;
  responseContent?: string;
  responseStatusCode?: string | number;

  response?: AxiosResponse;
}
export interface ActionParamsBuildTime extends BaseParams {
  appName: string;
  time: number;
  status?: boolean;
  mode?: string;
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
  // 已加到 BaseParams 中
  version?: string;
  
  // 无用
  user_agent: string;
  source_url: string;
}

type NoticeSend = boolean | number | undefined;

interface NoticeParams {
  send?: NoticeSend;
  title?: string;
  msg?: string;
}

// ApiError参数
export interface ApiErrorParams extends BaseParams {
  requestMethod: string;
  requestPath: string;
  requestParams?: string;
  responseContent?: string;
  responseStatusCode?: string | number;

  response?: AxiosResponse;

  // 无用
  userInfo?: UserInfoParams;
  apiInfo?: ApiInfoParams;
  other?: ApiErrorOtherParams;
}

// ApiError参数
export interface ApiInfoActionParams extends BaseParams {
  requestMethod: string;
  requestPath: string;
  requestParams?: string;
  responseContent?: string;
  responseStatusCode?: string | number;

  response?: AxiosResponse;

  // 无用
  userInfo?: UserInfoParams;
  apiInfo?: ApiInfoParams;
  other?: ApiErrorOtherParams;
}

// NotMatch参数
export interface NotMatchParams extends BaseParams {
  other?: ApiErrorOtherParams;
}

// Report参数
export interface ReportParams extends BaseParams {
  other?: OptionalOtherParams;
}

// BuildTime参数
export interface BuildTimeParams extends BaseParams {
  other?: OptionalOtherParams;
}

export interface Context {
  initOptions?: InitParams;
  options?: ApiErrorParams | NotMatchParams | ReportParams | BuildTimeParams;
}

export interface SendParams extends Object {
  uidStr?: string;
  [params: string]: any;
}
