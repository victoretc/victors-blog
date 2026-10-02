import { Api } from './Api'

let currentAccessToken: string | null = null
let currentRefreshToken: string | null = null
let isRefreshing = false

export function setTokens(access: string | null, refresh: string | null) {
  currentAccessToken = access
  currentRefreshToken = refresh
}

export function clearTokens() {
  currentAccessToken = null
  currentRefreshToken = null
}

function getCsrfToken(): string | null {
  const match = document.cookie.match(/csrftoken=([\w-]+)/)
  return match ? match[1] : null
}

const csrfSafeMethod = (method: string) =>
  ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method.toUpperCase())

export const api = new Api({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  customFetch: async (url, options = {}) => {
    const csrfToken = getCsrfToken()
    if (csrfToken && options.method && !csrfSafeMethod(options.method)) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          'X-CSRFToken': csrfToken,
        },
      }
    }

    if (currentAccessToken) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${currentAccessToken}`,
        },
      }
    }

    let response = await fetch(url, options)

    if (response.status === 401 && currentRefreshToken && !isRefreshing) {
      isRefreshing = true
      try {
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/token/refresh/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: currentRefreshToken, access: '' }),
          },
        )

        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          currentAccessToken = data.access
          if (data.refresh) currentRefreshToken = data.refresh

          options = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${currentAccessToken}`,
            },
          }
          response = await fetch(url, options)
        } else {
          clearTokens()
        }
      } finally {
        isRefreshing = false
      }
    }

    return response
  },
})
