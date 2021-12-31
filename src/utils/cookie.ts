// 封装cookie操作-
export const feupCookie = {
  get(keys: String) {
    if (typeof document === "undefined") return '';

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
    if (typeof document === "undefined") return;
    
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
  getFigui: (env: string) => {
    const envPrefix = env === 'prod' ? '' : `${env}_`;
    return feupCookie.get(`${envPrefix}figui`);
  },
  getFigId: (env: string, createFigIdFn: () => string) => {
    const envPrefix = env === 'prod' ? '' : `${env}_`;
    let figId = feupCookie.get(`${envPrefix}figId`);

    if (!figId && createFigIdFn) {
      figId = createFigIdFn();
      feupCookie.set(`${envPrefix}figId`, figId, new Date(9999, 11, 31));
    }
    return figId;
  },
};
