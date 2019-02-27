import React, { useEffect, useRef } from 'react';
import quicklink, { manualRemovePreFetch} from '@jsonz/quicklink';

function QuicklinkHookDemo() {
  const refRoot = useRef(null);

  useEffect(()=> {
    quicklink({
      el: refRoot.current,
    });
    return ()=> {
      batchManualRemove(refRoot.current);
    }
  });

  return ( <div ref={refRoot}>{this.props.children}</div> );
}

export default QuicklinkHookDemo;