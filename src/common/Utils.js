import dfnFormat from "date-fns/format";
import * as yup from "yup";

export function formatTableDate(date) {
  return dfnFormat(new Date(date), "dd MMM, yyyy");
}

export function formatCurrencyToNumber(string) {
  return string.toString().replace(/,/g, "");
}

export function formatNumber(n) {
  return n
    .toString()
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatNumberToCurrency(number = "", decimalPlace = false) {
  let value = number.toString();
  const decimalPosition = value.indexOf(".");
  if (decimalPosition >= 0) {
    let leftSide = formatNumber(value.substring(0, decimalPosition));
    let rightSide = formatNumber(value.substring(decimalPosition));
    if (decimalPlace) {
      rightSide += "00";
    }

    rightSide = rightSide.substring(0, 2);
    value = leftSide + "." + rightSide;
  } else {
    value = formatNumber(value);
    if (decimalPlace) {
      value += ".00";
    }
  }
  return value;
}

export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export const isObjectEmpty = (obj) => Object.keys(obj).length === 0;

export function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    const newTarget = [...target];
    for (const key in source) {
      if (typeof source[key] === "object") {
        newTarget[key] = deepMerge(newTarget[key] || {}, source[key]);
      } else {
        newTarget[key] =
          typeof source[key] === "boolean"
            ? source[key]
            : source[key] || newTarget[key];
      }
    }
  } else if (isObject(target) && isObject(source)) {
    const newTarget = { ...target };
    for (const key in source) {
      if (isObject(source[key])) {
        newTarget[key] = deepMerge(newTarget[key] || {}, source[key]);
      } else {
        newTarget[key] =
          typeof source[key] === "boolean"
            ? source[key]
            : source[key] || newTarget[key];
      }
    }
    return newTarget;
  }
  return undefined;
}

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    /* eslint-disable no-self-compare */
    return x !== x && y !== y;
  }
}

export function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

/**
 * @template C
 * @param {C} callback
 * @param {number} wait
 * @returns {C & {flush: Function, cancel: Function}}
 */
export function debounce(callback, wait = 0) {
  let debounceTimer;
  let triggerArgs;
  let triggerThis;

  function trigger(...arg) {
    triggerArgs = arg;
    triggerThis = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
    }, wait);
  }

  trigger.cancel = () => clearTimeout(debounceTimer);
  trigger.flush = () => {
    clearTimeout(debounceTimer);
    callback.apply(triggerThis, triggerArgs);
  };

  return trigger;
}

export function throttle(callback, wait = 0) {
  let throttleTimer;
  let triggerArgs;
  let triggerThis;
  function trigger() {
    triggerArgs = arguments;
    triggerThis = this;
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
      throttleTimer = false;
    }, wait);
  }

  trigger.cancel = () => clearTimeout(throttleTimer);
  trigger.flush = () => {
    clearTimeout(throttleTimer);
    callback.apply(triggerThis, triggerArgs);
  };

  return trigger;
}

export function objectToFormData(data) {
  const fd = new FormData();
  for (const key in data) {
    fd.set(key, data[key]);
  }
  return fd;
}

/**
 *
 * @param {Date | string | number} from
 * @param {Date | string | number} to
 */
export function getCountdown(from, to) {
  const oneSecondInMilli = 1000,
    oneMinuteInMilli = oneSecondInMilli * 60,
    oneHourInMilli = oneMinuteInMilli * 60,
    oneDayInMilli = oneHourInMilli * 24;

  const _from = new Date(from),
    _to = new Date(to),
    _fromTime = _from.getTime(),
    _toTime = _to.getTime(),
    distance = _toTime - _fromTime;

  const days = Math.floor(distance / oneDayInMilli),
    hours = Math.floor((distance % oneDayInMilli) / oneHourInMilli),
    minutes = Math.floor((distance % oneHourInMilli) / oneMinuteInMilli),
    seconds = Math.floor((distance % oneMinuteInMilli) / oneSecondInMilli);

  return { days, hours, minutes, seconds };
}

/**
 * @template {{[x: string]: any}} T
 * @param {URLSearchParams} searchParams
 * @param {T} params
 * @returns {T}
 */
export function urlSearchParamsExtractor(searchParams, params = {}) {
  if (searchParams && params) {
    const result = {};
    for (const key in params) {
      result[key] = searchParams.get(key) || params[key];
    }
    return result;
  }
  return params;
}

export function getTextFieldFormikProps(formik, key) {
  return {
    ...formik.getFieldProps(key),
    error: !!formik.touched[key] && !!formik.errors[key],
    helperText: !!formik.touched[key] && formik.errors[key],
  };
}

export function yupFileSchema(message) {
  return yup.mixed().test(
    "isFile",
    // eslint-disable-next-line no-template-curly-in-string
    message || "${path} not a file",
    (value) => value && value instanceof File
  );
}

export function configureRoute(route) {
  const Element = route.element;
  const element =
    Element.$$typeof === Symbol.for("react.element") ? Element : <Element />;
  const configured = { ...route, element };
  if (route.children?.length) {
    return { ...configured, children: route.children.map(configureRoute) };
  }
  return configured;
}
