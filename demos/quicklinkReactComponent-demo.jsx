/*
 * @Author: 率小火汁Jsonz
 * @Date: 2019-02-26 10:27:39
 * @Last Modified by: 率小火汁Jsonz
 * @Last Modified time: 2019-02-27 09:46:25
 * @Description: 一般来说，react组件是没什么卵用的，因为都是异步渲染，didMounter之后，建议关键的地方手动触发好点
*/

import React from 'react';
import quicklink, { batchManualRemove } from '@jsonz/quicklink';

class QuicklinkComponent extends React.Component {
  constructor(props) {
    super(props);
    this.refDom = null;
  }

  componentDidMount() {
    // didMount 监听组件内所有的a链接
    quicklink({
      el: this.refDom
    });
  }

  componentWillUnmount() {
    // willunmount 移除所有的监听
    batchManualRemove(this.refDom);
  }

  render() {
    return <div ref={d=> this.refDom = d}>{this.props.children}</div>
  }
}

export default QuicklinkComponent;
