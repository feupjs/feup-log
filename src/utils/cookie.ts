// 封装cookie操作-
export const kkbCookie = {
  get(keys: String) {
    let mat = new RegExp('(^|[^a-z])' + keys + '=(.*?)(;|$)', 'i').exec(
      document.cookie
    );
    return mat ? decodeURIComponent(mat[2]) : '';
  },
  set(
    name: string,
    value: string,
    expires: Date | null = null,
    path: string | null = null,
    domain: string | null = null,
    secure: boolean | null = null
  ) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toUTCString();
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
  unset(
    name: string,
    path: string | null = null,
    domain: string | null = null,
    secure: string | null = null
  ) {
    this.set(name, '', new Date(0), path, domain, secure);
  },
};
