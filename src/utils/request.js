const ajax = function (options) {
  options = options || {};
  options.baseUrl = options.baseUrl || '';
  return xhrConnection(
    options.method,
    options.baseUrl + options.url,
    options.data || null,
    options
  );
};

const xhrConnection = function (type, url, data, options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const featuredUrl = getUrlWithData(url, data, type);
    xhr.open(type, featuredUrl, true);
    xhr.withCredentials = options.hasOwnProperty('withCredentials');
    setHeaders(xhr, options.headers, data);
    xhr.addEventListener(
      'readystatechange',
      function () {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            let ret;
            try {
              ret = JSON.parse(xhr.responseText);
            } catch (e) {
              ret = xhr.responseText;
            }
            resolve(ret);
          } else {
            reject(xhr);
          }
        }
      },
      false
    );
    xhr.addEventListener('error', function (e) {
      reject(e);
    });

    xhr.send(isObject(data) ? JSON.stringify(data) : data);
  });
};

function getUrlWithData(url, data, type) {
  if (type.toLowerCase() !== 'get' || !data) {
    return url;
  }
  const dataAsQueryString = objectToQueryString(data);
  const queryStringSeparator = url.indexOf('?') > -1 ? '&' : '?';
  return url + queryStringSeparator + dataAsQueryString;
}
function objectToQueryString(data) {
  return isObject(data) ? getQueryString(data) : data;
}

function isObject(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

function getQueryString(obj, prefix) {
  return Object.keys(obj)
    .map(function (key) {
      if (obj.hasOwnProperty(key) && undefined !== obj[key]) {
        const val = obj[key];
        key = prefix ? prefix + '[' + key + ']' : key;
        return val !== null && typeof val === 'object'
          ? getQueryString(val, key)
          : encode(key) + '=' + encode(val);
      }
    })
    .filter(Boolean)
    .join('&');
}
function hasContentType(headers) {
  return Object.keys(headers).some(function (name) {
    return name.toLowerCase() === 'content-type';
  });
}

function setHeaders(xhr, headers, data) {
  headers = headers || {};
  if (!hasContentType(headers)) {
    headers['Content-Type'] = isObject(data)
      ? 'application/json'
      : 'application/x-www-form-urlencoded';
  }
  Object.keys(headers).forEach(function (name) {
    headers[name] && xhr.setRequestHeader(name, headers[name]);
  });
}

function encode(value) {
  return encodeURIComponent(value);
}
const get = function (options) {
  return ajax({
    method: 'get',
    ...options,
  });
};
const post = function (options) {
  return ajax({
    method: 'post',
    ...options,
  });
};
export { ajax, get, post };
