import { performance } from 'perf_hooks';

export const performanceTest = {
  start: (name: string): void => {
    performance.mark(`${name}start`);
  },
  end: (name: string): void => {
    performance.mark(`${name}end`);
    performance.measure(name, `${name}start`, `${name}end`);
  },
};
