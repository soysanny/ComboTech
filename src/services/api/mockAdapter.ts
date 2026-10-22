import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * mockAdapter — the single switch point between mock data and a real backend.
 *
 * When {@link USE_MOCK} is true, {@link createMockAdapter} is installed as the
 * Axios `adapter`, and every request is resolved from in-memory mock handlers
 * instead of hitting the network. When a real backend exists, flip
 * NEXT_PUBLIC_USE_MOCK to "false" (or remove it) — no component or service
 * code needs to change.
 */

export const USE_MOCK =
  (process.env.NEXT_PUBLIC_USE_MOCK ?? "true").toLowerCase() !== "false";

/** Simulated network latency range (ms) for a realistic UI feel. */
const MOCK_LATENCY_MS: [number, number] = [120, 380];

export type MockHandler = (
  ctx: MockRequestContext,
) => MockResult | Promise<MockResult>;

export interface MockRequestContext {
  method: string;
  url: string;
  /** Path params captured from a registered pattern. */
  params: Record<string, string>;
  /** Parsed query string params. */
  query: URLSearchParams;
  /** Parsed request body (if any). */
  body: unknown;
  headers: Record<string, unknown>;
}

export interface MockResult {
  status?: number;
  data: unknown;
}

interface RegisteredHandler {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: MockHandler;
}

const handlers: RegisteredHandler[] = [];

/**
 * Convert an endpoint template like "/products/:id" into a matching RegExp
 * plus the ordered list of param keys.
 */
function compilePath(path: string): { pattern: RegExp; keys: string[] } {
  const keys: string[] = [];
  const normalized = path.replace(/:[^/]+/g, (match) => {
    keys.push(match.slice(1));
    return "([^/]+)";
  });
  return { pattern: new RegExp(`^${normalized}$`), keys };
}

/**
 * Register a mock handler for a method + path template. Called by service-layer
 * mock registries (never by feature/UI code).
 */
export function registerMock(
  method: string,
  path: string,
  handler: MockHandler,
): void {
  const { pattern, keys } = compilePath(path);
  handlers.push({ method: method.toUpperCase(), pattern, keys, handler });
}

function delay(): Promise<void> {
  const [min, max] = MOCK_LATENCY_MS;
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseBody(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

/**
 * Merge the URL's own query string with axios `config.params` into a single
 * URLSearchParams. Custom adapters receive `params` separately — axios only
 * serializes them into the URL inside its built-in adapters — so mock handlers
 * must merge them explicitly or filters/search/sort/pagination silently no-op.
 */
function buildQuery(queryString: string, params: unknown): URLSearchParams {
  const query = new URLSearchParams(queryString);
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => query.append(key, value));
  } else if (params && typeof params === "object") {
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.set(key, Array.isArray(value) ? value.join(",") : String(value));
    });
  }
  return query;
}

/** Build an Axios-compatible response object. */
function toAxiosResponse(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): AxiosResponse {
  return {
    data,
    status,
    statusText: status >= 200 && status < 300 ? "OK" : "Error",
    headers: {},
    config,
  };
}

/**
 * Create the Axios adapter that resolves requests from registered mock
 * handlers. Unmatched routes reject with a 404 to mirror real API behavior.
 */
export function createMockAdapter(): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    await delay();

    const method = (config.method ?? "get").toUpperCase();
    const rawUrl = config.url ?? "";
    const [path, queryString = ""] = rawUrl.split("?");

    for (const entry of handlers) {
      if (entry.method !== method) continue;
      const match = entry.pattern.exec(path);
      if (!match) continue;

      const params: Record<string, string> = {};
      entry.keys.forEach((key, index) => {
        params[key] = decodeURIComponent(match[index + 1] ?? "");
      });

      const ctx: MockRequestContext = {
        method,
        url: rawUrl,
        params,
        query: buildQuery(queryString, config.params),
        body: parseBody(config.data),
        headers: (config.headers ?? {}) as Record<string, unknown>,
      };

      const result = await entry.handler(ctx);
      const status = result.status ?? 200;
      if (status >= 400) {
        return Promise.reject(
          Object.assign(new Error(`Mock request failed: ${status}`), {
            response: toAxiosResponse(config, status, result.data),
            config,
            isAxiosError: true,
          }),
        );
      }
      return toAxiosResponse(config, status, result.data);
    }

    return Promise.reject(
      Object.assign(new Error(`No mock handler for ${method} ${path}`), {
        response: toAxiosResponse(config, 404, {
          message: `Not found: ${path}`,
          status: 404,
        }),
        config,
        isAxiosError: true,
      }),
    );
  };
}
