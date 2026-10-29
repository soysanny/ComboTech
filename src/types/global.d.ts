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
    /** particles.js global, set when the library is loaded. */
    particlesJS?: (id: string, params: unknown) => void;
    /** Registry of active particles.js instances. */
    pJSDom?: PjsInstance[];
  }
}

export {};
