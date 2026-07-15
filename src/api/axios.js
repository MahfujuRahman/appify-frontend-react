import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  storeSession,
} from "../auth/session";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const requestInterceptors = [];
let refreshPromise = null;

function normalizeHeaders(headers = {}) {
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  return { ...headers };
}

function buildUrl(url, params) {
  const base = new URL(BASE_URL);
  const normalizedPath = `${base.pathname.replace(/\/$/, "")}/${String(url).replace(/^\//, "")}`;
  const target = new URL(base.toString());
  target.pathname = normalizedPath;
  target.search = "";

  if (params && typeof params === "object") {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        target.searchParams.set(key, String(value));
      }
    });
  }

  return target.toString();
}

function createError(response, data) {
  const error = new Error(data?.message || "Request failed");
  error.response = {
    status: response.status,
    data,
    headers: response.headers,
  };

  return error;
}

function isAuthEndpoint(url = "") {
  const path = String(url);
  return [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
  ].some((endpoint) => path.includes(endpoint));
}

async function performRequest(method, url, config = {}) {
  let finalConfig = {
    method,
    url,
    baseURL: BASE_URL,
    headers: {},
    params: {},
    data: undefined,
    ...config,
  };

  for (const interceptor of requestInterceptors) {
    finalConfig = (await interceptor(finalConfig)) || finalConfig;
  }

  const headers = new Headers(normalizeHeaders(finalConfig.headers));
  headers.set("Accept", "application/json");
  headers.set("X-Requested-With", "XMLHttpRequest");
  const bodyIsFormData =
    typeof FormData !== "undefined" && finalConfig.data instanceof FormData;

  if (
    !bodyIsFormData &&
    finalConfig.data !== undefined &&
    finalConfig.data !== null &&
    method !== "GET"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(finalConfig.url, finalConfig.params), {
    method,
    headers,
    body:
      method === "GET"
        ? undefined
        : bodyIsFormData
          ? finalConfig.data
          : finalConfig.data !== undefined && finalConfig.data !== null
            ? JSON.stringify(finalConfig.data)
            : undefined,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  const payload = {
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
    data,
  };

  if (!response.ok) {
    throw createError(payload, data);
  }

  return payload;
}

async function refreshSession() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performRequest("POST", "/auth/refresh", {
    data: { refresh_token: refreshToken },
    skipAuthRefresh: true,
  })
    .then((response) => {
      const data = response?.data || {};
      const sessionUser = data.user;
      const nextToken = data.token;
      const nextRefreshToken = data.refresh_token;

      if (!sessionUser || !nextToken || !nextRefreshToken) {
        throw new Error("Invalid refresh response");
      }

      storeSession({
        user: sessionUser,
        token: nextToken,
        refreshToken: nextRefreshToken,
      });

      return response;
    })
    .catch((error) => {
      clearSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function request(method, url, config = {}) {
  try {
    return await performRequest(method, url, config);
  } catch (error) {
    const status = error?.response?.status;
    const shouldRefresh =
      !config.skipAuthRefresh &&
      !config._retriedAfterRefresh &&
      !isAuthEndpoint(url) &&
      (status === 401 || status === 403) &&
      getRefreshToken();

    if (!shouldRefresh) {
      throw error;
    }

    try {
      await refreshSession();
      return await performRequest(method, url, {
        ...config,
        _retriedAfterRefresh: true,
      });
    } catch (refreshError) {
      throw refreshError?.response ? refreshError : error;
    }
  }
}

const api = {
  baseURL: BASE_URL,
  interceptors: {
    request: {
      use(handler) {
        requestInterceptors.push(handler);
      },
    },
  },
  get(url, config = {}) {
    return request("GET", url, config);
  },
  post(url, data, config = {}) {
    return request("POST", url, { ...config, data });
  },
  put(url, data, config = {}) {
    return request("PUT", url, { ...config, data });
  },
  patch(url, data, config = {}) {
    return request("PATCH", url, { ...config, data });
  },
  delete(url, config = {}) {
    return request("DELETE", url, config);
  },
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default api;
