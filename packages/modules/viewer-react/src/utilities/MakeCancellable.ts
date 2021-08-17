/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export function makeCancellable(
  fn: (args?: any[]) => Generator<Promise<any> | Promise<void>, void, any>,
  ...args: any[]
): { promise: Promise<any>; cancel: () => void } {
  const gen = fn(...args);
  let cancelled = false;
  let cancel: () => void = () => {
    // nothing to cancel
  };
  const promise = new Promise((resolve, reject) => {
    cancel = () => {
      cancelled = true;
      reject({ reason: "cancelled" });
    };

    onFulfilled();

    function onFulfilled(res?: any) {
      if (!cancelled) {
        let result;
        try {
          result = gen.next(res);
        } catch (e) {
          return reject(e);
        }
        next(result);
        return null;
      }
    }

    function onRejected(err: any) {
      let result;
      try {
        result = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(result);
    }

    function next({
      done,
      value,
    }: IteratorResult<Promise<void> | Promise<void[]>>) {
      if (done) {
        return resolve(value);
      }
      return value.then(onFulfilled, onRejected);
    }
  });

  return { promise, cancel };
}
