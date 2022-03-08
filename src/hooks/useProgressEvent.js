import { useState } from "react";

function useProgressEvent(options = {}) {
  const [state, setState] = useState(() => ({
    progress: options?.progress || 0,
    progressEvent: null,
  }));

  function onProgress(progressEvent) {
    if (progressEvent.lengthComputable) {
      setState({
        progress: (100 / progressEvent.total) * progressEvent.loaded,
        progressEvent,
      });
    }
    options?.onProgress?.(...arguments);
  }
  return /** @type {[typeof onProgress, typeof state]} */ [onProgress, state];
}

export default useProgressEvent;
