import * as crypto from 'crypto';

// const isMobile = /(iphone|android)/.test(navigator.userAgent.toLowerCase());
const $ = (selector, node) => {
  let n = node ? node : document;
  return typeof selector === 'string' ? n.querySelector(selector) : selector;
};

const create = (type, className, innerHTML) => {
  if (typeof document === "undefined") return;

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
  if (typeof document === "undefined") return;

  return document.createDocumentFragment(type);
};

// 动态加载js并支持回调-
function loadJs(src, callback) {
  if (typeof document === "undefined") return;

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
    if (typeof document === "undefined") return '';

    const mat = new RegExp('(^|[^a-z])' + keys + '=(.*?)(;|$)', 'i').exec(
      document.cookie
    );
    return mat ? decodeURIComponent(mat[2]) : '';
  },
  set(name, value, expires, path, domain, secure) {
    if (typeof document === "undefined") return '';
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

/**
 * 解密 figui
 * @param {String} figui userId 密文
 */
const decryption = (figui) => {
  // 将字符串中所有的A替换成0
  let str = figui.replaceAll('A', 0); // '0wSjG569syGq2602'
  // 匹配str中所有的数字，并反转
  const uidArr = [...str.match(/\d/g)].reverse(); // ['2', '0', '6', '2', '9', '6', '5', '0']
  // 得到uid并返回
  const uid = uidArr.join(''); // '20629650'
  return uid;
}

export {
  $,
  create,
  cookie,
  createFrag,
  loadJs,
  // isMobile,
  aesEncode,
  decryption
};
