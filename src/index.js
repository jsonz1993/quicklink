/*
 * @Author: 率小火汁Jsonz
 * @Date: 2019-02-25 17:33:09
 * @Last Modified by: 率小火汁Jsonz
 * @Last Modified time: 2019-02-26 20:26:48
 * @Description: prefetch module
 * 使用:
 * - 默认情况
 * quicklink(options);
 * @options timeoutFn 执行监听绑定的函数，默认是 requestIdleCallback
 * @options timeout 执行监听的最后期限
 * @options el 在该组件下寻找a标签监听
 * @options allowed 允许的域名，默认是当前域名
 * @options ignores 要忽略的链接
 * @options urls 直接对urls进行预加载
 *
 * - 移除单个监听
 * manualRemovePreFetch(dom, link)
 * @dom 移除监听的dom
 * @link 移除监听的link，不传会取 dom.href
 *
 * - 批量移除监听
 * batchManualRemove(dom)
 * @dom 移除传入的dom or document 下面所有找到的a标签的监听
 *
 * - 设置全局配置 quicklink 会读取全局配置
 * setQuicklinkOptions(options)
 *
 * - 获取全局配置
 * getQuicklinkOptions
 *
 * - 手动设置监听某个dom
 * manualPreFetch(options)
 * @options dom 要监听的dom，没有强制要求是什么类型
 * @options isForce 是否强制，如果传true，直接preFetch而不是监听再 preFetch
 * @options link 执行prefetch的link
 * @options priority 传true就用FetchAPI，不明所以
 * @return 返回一个可以取消监听的函数
 *
*/
import 'intersection-observer';
import prefetch from './prefetch';
import requestIdleCallback from './request-idle-callback';
import noop from './noop';

// prefetch list
const toPrefetch = new Set();

// 默认的全局配置
const quicklinkOptions = {
  ignores: [],
  priority: false,
  allowed: [location.hostname],
  timeout: 4e3,
  timeoutFn: requestIdleCallback,
};

/**
 * 获取全局的 quicklinkOptions
 * @return {Object}
 */
export function getQuicklinkOptions() {
  return quicklinkOptions;
}

/**
 * 设置全局的 quicklinkOptions
 * @param {Object} options
 * @return {Object} new options
 */
export function setQuicklinkOptions(options) {
  Object.assign(quicklinkOptions, options);
  return quicklinkOptions;
}

/**
 * 默认监控
 * 1. 触发回调后，判断是否进入用户界面
 * 2. 在 prefetch 列表里面的才执行该操作做
 * 3. 取消监听并执行预加载
 */
const defaultObserver = new IntersectionObserver(entries=> {
  entries.forEach(entry=> {
    if (!entry.isIntersecting) return;

    const dom = entry.target;
    const link = dom.dataset.href || dom.href;

    if (!toPrefetch.has(link)) return;
    defaultObserver.unobserve(dom);
    prefetcher(link, quicklinkOptions.priority);
  });
});


/**
 * @param {String} url
 * @param {Boolean} priority
 */
function prefetcher(url, priority= false) {
  toPrefetch.delete(url);
  prefetch(new URL(url, location.href).toString(), priority);
}

/**
 * @param {String} link
 * @param {Mixed} filter
 * @return {Boolean}
 */
function isIgnored(link, filter) {
  return Array.isArray(filter)
    ? filter.some(x=> isIgnored(link, x))
    : (filter.test || filter).call(filter, link);
}

/**
 * 手动触发dom监听或者直接触发preload
 * 1. 如果isForce是true，直接调用, return
 * 2. 如果 toPrefetch 有，则不需要处理
 * 3. 如果没有，则手动添加到 observer 监听
 * @param {Object} options
 * @return {Function} 返回手动移除的函数，isForce 没有这种操作
 */
export function manualPreFetch({dom, isForce, link, priority}={}) {
  if (!dom) {
    console.warn('@arguments: dom is require');
    return noop;
  }
  const href = link || dom.href;
  dom.dataset.href = href;

  if (isForce) {
    prefetch(new URL(href, location.href).toString, priority);
    return noop;
  }
  if (toPrefetch.has(href) || isIgnored(href, quicklinkOptions.ignores)) return noop;

  defaultObserver.observe(dom);
  toPrefetch.add(href);

  return ()=> manualRemovePreFetch(dom, href);
}

/**
 * 手动移除监听
 * @param {Object} dom
 * @param {String} link
 */
export function manualRemovePreFetch(dom, link) {
  if (!dom) return;
  link = link || dom.dataset.href || dom.href;
  defaultObserver.unobserve(dom);
  toPrefetch.delete(link);
}

/**
 * 批量移除监听
 * @param {Object} dom
 */
export function batchManualRemove(dom) {
  Array.from((dom || document).querySelectorAll('a'), manualRemovePreFetch);
}

/**
 * 默认的函数
 * @param {*} options
 */
export default function (options= {}) {
  const userOptions = Object.assign({}, options, quicklinkOptions);

  const {timeoutFn, timeout, el, allowed, ignores, urls} = userOptions;

  timeoutFn(()=> {
    if (urls) urls.forEach(prefetcher);
    else {
      Array.from((el || document).querySelectorAll('a'), dom=> {
        if (!allowed.length || allowed.includes(dom.hostname)) {
          defaultObserver.observe(dom);
          isIgnored(dom.href, ignores) || toPrefetch.add(dom.href);
        }
      });
    }
  }, {timeout});
}

