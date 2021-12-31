import { ApiInfoParams, XhrProxyParam } from '../../interface/NvwaParams';
import { queryToObj } from '../../utils/request';
import { proxyDomain } from '../../config/domain';

/** 一小时内 */
const AN_HOUR_MAX_SEND_NUM = 30;
/** 统计周期时间 */
const CYCLE_TIME = 3600000;
/** localstorage 存储的名称 */
const STORAGE_NAME = "figlog_cacheXhr";

let _initParams: XhrProxyParam = {};

type ReportCallBack = (apiInfo: ApiInfoParams) => any

// 代理XMLHttpRequest 没找到TS版本可以用的proxy-polyfill，所以使用了AOC去代理
type UseOn = <K extends keyof XMLHttpRequestEventMap>(
  this: XMLHttpRequest & { 
    _requestBody: string, 
    _requestMethod: 'GET' | 'POST' 
  }, 
  report: ReportCallBack, 
  ev: XMLHttpRequestEventMap[K],
) => void;

function validateStatus(status: XMLHttpRequest["status"]) {
  return status >= 200 && status < 300;
}
function formatResponse(xhr: XMLHttpRequest) { 
  if ((xhr.responseType === 'text' || xhr.responseType === '') && xhr.responseText) {
    return xhr.responseText;
  }
  if (xhr.response && typeof xhr.response === 'object') { 
    return JSON.stringify(xhr.response); 
  } 
  if (xhr.response && typeof xhr.response === 'string') { 
    return xhr.response; 
  } 
  if (xhr.responseText) { 
    return xhr.responseText;
  } 
  return null; 
} 

/**
 * 检查请求路径是否需要代理
 * @param url 请求路径
 */
function checkUrl(url: string) {
  if (url.includes('nvwa-log-api')) return false;
  const userDomain = (_initParams.xhrProxy 
    && typeof _initParams.xhrProxy === "object" 
    && _initParams.xhrProxy.domain) ? _initParams.xhrProxy.domain : [];

  return RegExp(`^(http|https):\/\/(.*).(${[...proxyDomain, ...userDomain].join('|')})`).test(url)
}

let cacheXhr: {[key: string]: { sendTime: number }[]} = JSON.parse(localStorage.getItem(STORAGE_NAME) || "{}");

function checkNum(url: string) {
  if (!cacheXhr[url]) return true;

  const startTime = Date.now() - CYCLE_TIME;
  const anHourSendNum = cacheXhr[url].filter(item => item.sendTime > startTime).length;
  return anHourSendNum < AN_HOUR_MAX_SEND_NUM;
}

function recordUrlSendTime(url: string) {
  if (!cacheXhr[url]) {
    cacheXhr[url] = [{ sendTime: Date.now() }];

    setTimeout(() => {
      clear();
      setCacheXhrStorage();
    }, 0)
    return
  }
  cacheXhr[url].push({ sendTime: Date.now() })

  setTimeout(() => {
    clear();
    setCacheXhrStorage();
  }, 0)
}

function setCacheXhrStorage() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(cacheXhr));
}

/**
 * 清理超过一小时的请求记录
 */
function clear() {
  const startTime = Date.now() - CYCLE_TIME;
  Object.entries(cacheXhr).forEach(([key, records]) => {
    cacheXhr[key] = records.filter(({ sendTime }) => sendTime > startTime);
  })
}

// 代理 onerror
const useOnError: UseOn = function useOnError(this, reportCallBack: ReportCallBack) {
  const this_ = this

  this.addEventListener('readystatechange', function () {
    if (!this_ || this_.readyState !== 4) return;
    
    if (!validateStatus(this_.status)) {
      if (this_.responseURL.indexOf('nvwa-log-api') !== -1) return // 过滤上报接口自身的异常

      // 超过规定时间最大发送次数
      if (!checkNum(this_.responseURL)) return;

      // 解析 GET 请求参数
      if (this_._requestMethod === 'GET') {
        const params = queryToObj(this_.responseURL);
        this_._requestBody = JSON.stringify(params) !== "{}" && JSON.stringify(params);
      }

      const responseBody = formatResponse(this_);

      // 记录接口上报次数
      recordUrlSendTime(this_.responseURL);

      // 上报
      reportCallBack({
        response_status_code: this_.status,
        request_method: this_._requestMethod,
        request_path: this_.responseURL,
        request_params: this_._requestBody || "无",
        response_content: responseBody,
      })
    }
  })
}

function XMLHttpRequestProxy(initParams: XhrProxyParam, reportCallBack: ReportCallBack): void {
  if (typeof XMLHttpRequest === "undefined") return;

  if (typeof initParams === "object") _initParams = initParams;
  
  const oldSend = XMLHttpRequest.prototype.send;
  const oldOpen = XMLHttpRequest.prototype.open;

  // 通过 open 获取并记录请求类型
  XMLHttpRequest.prototype.open = function <T>(...args: T[]): void {
    this._requestMethod = args[0];
    this._requestUrl = args[1];
    oldOpen.call(this, ...args);
  }

  XMLHttpRequest.prototype.send = function <T>(...args: T[]): void {
    // 检查请求路径是否需要代理
    // if (checkUrl(this._requestUrl)) {
    //   // 记录请求参数
     
    // }
    this._requestBody = args[0];
    this.addEventListener('error', useOnError.call(this, reportCallBack))
    oldSend.call(this, ...args);
  }
}

export default XMLHttpRequestProxy;