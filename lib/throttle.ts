// Taken from https://stackoverflow.com/a/27078401/20362635.
// Switch to lodash throttle if more options are needed.
/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time. Normally, the throttled function will run
 * as much as it can, without ever going more than once per `wait` duration;
 * but if you'd like to disable the execution on the leading edge, pass
 * `{leading: false}`. To disable execution on the trailing edge, ditto.
 */ 
export const throttle = (
  func: () => void,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
) => {
  let context, args, result;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  const later = function() {
    previous = options?.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function() {
    const now = Date.now();
    if (!previous && options?.leading === false) previous = now;
    const remaining = wait - (now - previous);
    // @ts-expect-error
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options?.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

export default throttle;
