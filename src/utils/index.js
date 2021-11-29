import * as crypto from 'crypto';

// const isMobile = /(iphone|android)/.test(navigator.userAgent.toLowerCase());
const $ = (selector, node) => {
  let n = node ? node : document;
  return typeof selector === 'string' ? n.querySelector(selector) : selector;
};

const create = (type, className, innerHTML) => {
  const ele = document.createElement(type);
  if (className) {
    ele.className = className;
  }
  if (innerHTML) {
    ele.innerHTML = innerHTML;
  }
  return ele;
};

const createFrag = (type) => {
  return document.createDocumentFragment(type);
};

// 动态加载js并支持回调-
function loadJs(src, callback) {
  let sc = document.createElement('script');
  sc.type = 'text/javascript';
  sc.src = src;
  if (callback) {
    if (document.addEventListener) {
      sc.addEventListener('load', callback, false);
    } else {
      sc.onreadystatechange = function () {
        if (/loaded|complete/.test(sc.readyState)) {
          sc.onreadystatechange = null;
          callback();
        }
      };
    }
  }
  document.body.appendChild(sc);
}

const cookie = {
  get(keys) {
    const mat = new RegExp('(^|[^a-z])' + keys + '=(.*?)(;|$)', 'i').exec(
      document.cookie
    );
    return mat ? decodeURIComponent(mat[2]) : '';
  },
  set(name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toGMTString();
    }
    if (path) {
      cookieText += '; path=' + path;
    }
    if (domain) {
      cookieText += '; domain=' + domain;
    }
    if (secure) {
      cookieText += '; secure';
    }
    document.cookie = cookieText;
  },
  remove(name, path, domain, secure) {
    this.set(name, '', new Date(0), path, domain, secure);
  },
};

// 创建加密算法
function aesEncode(cleardata) {
  const password = 'CKK7nQWj&9$4BpyQ';
  let cryptkey = crypto.createHash('sha256').update(password).digest(),
    iv = '1234567890000000';
  let encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
    encoded = encipher.update(cleardata, 'utf8', 'base64');

  encoded += encipher.final('base64');
  return encoded;
}

export {
  $,
  create,
  cookie,
  createFrag,
  loadJs,
  // isMobile,
  aesEncode,
};
