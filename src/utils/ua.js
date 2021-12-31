import UAParser from 'ua-parser-js'

/**
 * @author cuiyu
 *
 * @param ua
 * @returns
 */

const UA = (ua) => {
  if (ua) {
    let uaStr = ''
    const parser = new UAParser()
    const isMobile = /(iphone|android)/.test(ua.toLowerCase()) && 'H5'
    const isWX = ua.indexOf('MicroMessenger') > -1 && '微信'
    const isApp = ua.indexOf('kkbMobile') > -1 && 'APP'
    parser.setUA(ua)
    const result = parser.getResult()
    uaStr = `
${result.os.name} | ${result.os.version};
 ${result.browser.name} | ${result.browser.version};
 ${isWX || isMobile || isApp || 'PC'}`
    return uaStr
  } else {
    return undefined
  }
}

export default UA

