// 代理XMLHttpRequest 没找到TS版本可以用的proxy-polyfill，所以使用了AOC去代理
type UseOn = <K extends keyof XMLHttpRequestEventMap>(this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => void;

function validateStatus(status: XMLHttpRequest["status"]) {
    return status >= 200 && status < 300;
}

// 代理onreadystatechange
const useReadyStateChange: UseOn = function useReadyStateChange(this) {
    // 需要拿到返回结果时候才用的到
    // if (!this || this.readyState !== 4) return;
    const oldOnreadystatechange: XMLHttpRequest["onreadystatechange"] = this.onreadystatechange;
    this.onreadystatechange = function <T>(...args: T[]): void {
        console.log(2222, 'onreadystatechange in fig-log', this, this.readyState, ...args);
        oldOnreadystatechange && oldOnreadystatechange.call(this, ...args);
    }
}

// 代理onerror
const useOnError: UseOn = function useOnError(this, ev) {
    console.log(2222, 'onerror in fig-log', this, ev);
}

// 代理onloadend
const useLoadend: UseOn = function useLoadend(this) {
    // TODO: 需要屏蔽自身的接口判定
    if (!this || this.readyState !== 4) return;
    if (validateStatus(this.status)) {
        console.log(`fig-log check success. The status is ${this.status}`)
    } else {
        console.log(`fig-log check error. The status is ${this.status}`)
    }
}

function XMLHttpRequestProxy(): void {
    const oldOpen = XMLHttpRequest.prototype.open;
    const oldSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function <T>(...args: T[]): void {
        useReadyStateChange.call(this)
        this.addEventListener('loadstart', () => console.log('loadstart in fig-log.'));
        this.addEventListener('load', () => console.log('load in fig-log.'));
        this.addEventListener('loadend', useLoadend);
        this.addEventListener('progress', () => console.log('progress in fig-log.'));
        this.addEventListener('error', useOnError);
        this.addEventListener('abort', () => console.log('abort in fig-log.'));
        oldOpen.call(this, ...args)
    }

    XMLHttpRequest.prototype.send = function <T>(...args: T[]): void {
        // You need writing a some code!
        oldSend.call(this, ...args);
    }
}

export default XMLHttpRequestProxy;
