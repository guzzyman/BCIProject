import { useCallback, useRef, useState } from "react";
import { AsyncStatusEnum } from "common/Constants";
import useDataRef from "./useDataRef";

/**
 * @template D
 * @param {(...args: any[]) => Promise<any>} onLoad
 * @param {AsyncDataOptions<D>} options
 */
function useAsyncData(onLoad, options = {}) {
  const { initialState, condition = () => true } = options;
  const [status, setStatus] = useState(initialState || AsyncStatusEnum.IDLE);
  const [data, setData] = useState(null);

  const dataRef = useDataRef({ onLoad, status, condition, ...options });

  const promiseRef = useRef(null);

  const load = useCallback(
    async function load(...args) {
      if (dataRef.current.condition(dataRef.current.status)) {
        promiseRef.current = dataRef.current.onLoad(...args);
        setStatus(AsyncStatusEnum.PENDING);
        dataRef.current.onLoadStart?.();
        try {
          const data = await promiseRef.current;
          setStatus(AsyncStatusEnum.COMPLETED);
          setData(data);
          dataRef.current?.onLoadSuccess?.(data);
          dataRef.current?.onLoadEnd?.();
          return data;
        } catch (error) {
          setStatus(AsyncStatusEnum.REJECTED);
          dataRef.current?.onLoadError?.(error);
          dataRef.current?.onLoadEnd?.();
          if (dataRef.current.throwError) {
            throw error;
          }
        }
      }
    },
    [dataRef]
  );

  const stateResult = {
    data,
    setData,
    promise: promiseRef.current,
    status,
    setStatus,
    isIdle: status === AsyncStatusEnum.IDLE,
    isLoading: status === AsyncStatusEnum.PENDING,
    isError: status === AsyncStatusEnum.REJECTED,
    isDone: status === AsyncStatusEnum.COMPLETED,
  };

  return /** @type {[typeof load, typeof stateResult]} */ [load, stateResult];
}

export default useAsyncData;

/**
 * @template D
 * @typedef {{
 * initData: (() => D) | D;
 * throwError: boolean;
 * condition: (status: string) => boolean;
 * onLoadStart: () => void;
 * onLoadEnd: (data: any) => void;
 * onLoadSuccess: (data: any) => void;
 * onLoadError: (error: any) => void;
 * }} AsyncDataOptions<D>
 */
