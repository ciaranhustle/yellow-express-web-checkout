/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: ('square' | 'circle')[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  function confetti(options?: ConfettiOptions): Promise<null>;
  function confetti(resolve: (value: null) => void, reject: (reason: any) => void): void;
  function confetti(options: ConfettiOptions, resolve: (value: null) => void, reject: (reason: any) => void): void;

  namespace confetti {
    function create(canvas: HTMLCanvasElement, options?: { resize?: boolean; useWorker?: boolean }): typeof confetti;
    function reset(): void;
    function create(canvas: HTMLCanvasElement, options?: { resize?: boolean; useWorker?: boolean }): typeof confetti;
  }

  export = confetti;
} 