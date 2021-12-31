# feup-log

## 安装依赖

```
npm install feup-log

<br><br>

## 引入方式

```js
import Log from 'feup-log';
Log.init({
  app_id: 'xxx 这个appid从日志系统的应用管理获取 xxx',
  env: '环境 dev|test|pre|prod',
  debug: false, // boolean 默认为false，可设置为true，为false时，app_id需要是线上日志系统的app_id，为true时，app_id是传入env对应环境日志系统的app_id。
});
```

## API 方法介绍

### apiError

> 上传接口错误日志

```js
import Log from 'feup-log';
// 上报错误，以下参数是最小上报，必传
Log.report({
  type: 'apiError', // 固定
  title: '日志上报-标题',
  content: '日志上报-内容',
  apiInfo: {
    // 根据实际情况对接
    response_status_code: '404',
    request_method: 'POST',
    request_path: 'https://测试地址',
    request_params: `{test: '测试内容'}`,
    response_content: null,
  },
});

// 或者以下形式 v0.0.11+ 生效  ⚠️ response 优先级大于 apiInfo
Log.report({
  type: 'apiError', // 固定
  title: '日志上报-标题', // 非必填
  content: '日志上报-内容', //  非必填，如果要使用json，请使用JSON.stringify(obj)
  response: response, // response 为axios的返回值
});
 
// eg: (该示例非项目标准，仅演示apiError的上报方式)
request.interceptors.response.use(
  response => {
    if (response.data && response.data.code !== 1) {
      Log.report({
        type: 'apiError', // 固定
        response: response, // response 为axios的返回值
      });
    }
    return response
  },
  err => {
    const res = err && err.response
    res &&
      Log.report({
        type: 'apiError',
        response: res,
      })
    return Promise.reject(err)
  }
)
```

### apiInfo

> 上报接口调用信息（默认发送钉钉通知）

```js
import Log from 'feup-log';

// 上报信息，以下参数是最小上报，必传
Log.report({
  type: 'apiInfo',
  title: 'API 调试信息',
  content: '日志上报-内容',
  apiInfo: {
    response_status_code: '404',
    request_method: 'POST',
    request_path: 'https://测试地址',
    request_params: `{test: '测试内容'}`,
    response_content: null,
  },
});
```

### noMatch

> 上传 404 页面日志

```js
import Log from 'fig-report';
// 上报404页面日志，以下是最小上报，必传
Log.report({
  type: 'noMatch',
});
```

### other

> 主动上报通知（默认不发送钉钉通知）

```js
import Log from 'fig-report';
// 主动上报日志，以下是最小上报，必传，title、content、other非必传
Log.report({
  type: 'other',
  title: '这里是日志标题和通知标题',
  content:
    '这里是日志内容，默认会是时间、应用名称、环境、UA、页面地址、详情地址以及{{other.msg}}的集合',
  notice: number | boolean, // 是否发送钉钉通知
  other: {
    // other非必传，属于上报的额外数据
    msg: [
      { name: '自定义', value: '我是自定义内容' }, // 自定义：我是自定义内容
      { name: '钉钉通知列表的label', value: '钉钉通知列表的value' },
    ],
  },
});
```

### report

> 自定义上报通知（默认发送钉钉通知）
>
> 于 other 类型类似，other 默认不上报钉钉群

```js
import Log from 'fig-report';
// 主动上报日志，以下是最小上报，必传，title、content、other非必传
Log.report({
  type: 'report',
  title: '这里是日志标题和通知标题',
  content:
    '这里是日志内容，默认会是时间、应用名称、环境、UA、页面地址、详情地址以及{{other.msg}}的集合',
  other: {
    // other非必传，属于上报的额外数据
    msg: [
      { name: '自定义', value: '我是自定义内容' }, // 自定义：我是自定义内容
      { name: '钉钉通知列表的label', value: '钉钉通知列表的value' },
    ],
  },
});
```

### buildTime

> buildTime 通知

```js
import Log from 'fig-report';
// buildTime日志，以下是最小上报，必传，notice、other.msg 非必传
Log.report({
  type: 'buildTime',
  notice: number | boolean, // 是否发送钉钉通知
  other: {
    mode: '构建类型', // 类型 start/build
    app_name: '应用名称', // 应用名称
    time: 12312312312, // 总时长
    status: boolean, // 是否构建成功
    // msg非必传
    msg: [
      {
        name: '开始时间',
        value: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
      }, // 自定义：我是自定义内容
      {
        name: '结束时间',
        value: dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    ],
  },
});
```

## 查看更多

[API Document](https://fe.kaikeba.com/feup-log)
