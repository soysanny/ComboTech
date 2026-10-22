/**
 * Global ambient declarations.
 */

declare global {
  interface PjsInstance {
    pJS: {
      canvas: { el: HTMLCanvasElement };
      fn: { vendors: { destroypJS: () => void } };
    };
  }

  interface Window {
    /** Injected build-time flag toggling mock vs. real backend. */
    __SVC_USE_MOCK__?: boolean;
    /** particles.js global, set when the library is loaded. */
    particlesJS?: (id: string, params: unknown) => void;
    /** Registry of active particles.js instances. */
    pJSDom?: PjsInstance[];
  }
}

export {};
