export const toQueryString = (queryObject: Record<string, any>) => new URLSearchParams(queryObject).toString();

export const range: {
  (stop: number): number[];
  (start: number, stop: number): number[];
  (start: number, stop: number, interval: number): number[];
} = (...args: number[]): number[] => {
  let start: number = 0;
  let stop: number;
  let interval: number = 1;

  if (args.length === 1) {
    stop = args[0];
  } else if (args.length === 2) {
    start = args[0];
    stop = args[1];
  } else {
    start = args[0];
    stop = args[1];
    interval = args[2];
  }

  return Array.from(
    { length: Math.floor((stop - start) / interval) },
    (_, i) => start + i * interval
  );
};
