> Forked from GoogleChromeLabs/quicklink
> 自用 包含了 [`intersection-observer polyfill` ](https://www.npmjs.com/package/intersection-observer) 用于支持移动端


# 使用

默认情况见 [GoogleChromeLabs/quicklink](https://github.com/GoogleChromeLabs/quicklink/blob/1.0.0/README.md)

- 增加了移除单个监听
- 批量移除监听
- 设置全局配置
- 获取全局配置
- 手动设置监听某个dom(不一定要是a标签)

```
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
 * @options priority 传true就用FetchAPI
 * @return 返回一个可以取消监听的函数
```