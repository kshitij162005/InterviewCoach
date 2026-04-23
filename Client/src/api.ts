const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isLocalBrowser =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_BASE_URL = (configuredApiBaseUrl ||
  (isLocalBrowser ? "http://127.0.0.1:8000" : window.location.origin)
).replace(/\/$/, "");

const REQUEST_TIMEOUT_MS = 8000;

type HealthResponse = {
  status: string;
  detail?: string;
};

type RootResponse = {
  message: string;
};

type RequestErrorKind = "timeout" | "network" | "http";

class ApiRequestError extends Error {
  kind: RequestErrorKind;
  status?: number;
  url: string;

  constructor(kind: RequestErrorKind, message: string, url: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.kind = kind;
    this.status = status;
    this.url = url;
  }
}

async function parseJsonResponse<T>(response: Response, url: string): Promise<T> {
  if (!response.ok) {
    throw new ApiRequestError(
      "http",
      `Request failed with status ${response.status}`,
      url,
      response.status,
    );
  }

  return (await response.json()) as T;
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return parseJsonResponse<T>(response, url);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError(
        "timeout",
        `Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds`,
        url,
      );
    }

    throw new ApiRequestError(
      "network",
      "Network request failed. Backend may be down, unreachable, or blocked by CORS.",
      url,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function getApiRoot(): Promise<RootResponse> {
  return fetchJson<RootResponse>("/");
}

export async function getApiHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>("/health");
}

export async function getDatabaseHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>("/db/health");
}

export { API_BASE_URL, ApiRequestError };