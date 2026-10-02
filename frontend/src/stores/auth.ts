import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, setTokens, clearTokens } from '@/api'
import type { PatchedUserRequest, TokenRefresh, User } from '@/api/Api'

const AUTH_STORAGE_KEY = 'book_club_auth'

type AuthUser = User & {
  firstName?: string
  lastName?: string
  email?: string
  remoteAddr?: string
  isReadingListPublic?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isAuthenticated = computed(() => !!accessToken.value)

  const saveState = () => {
    const state = {
      user: user.value,
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
  }

  const loadState = () => {
    const savedState = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!savedState) return

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(savedState)
      if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid state')
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    user.value = (parsed.user as AuthUser) || null
    accessToken.value = (parsed.accessToken as string) || null
    refreshToken.value = (parsed.refreshToken as string) || null

    if (accessToken.value) {
      setTokens(accessToken.value, refreshToken.value)
    }
  }

  const requestCode = async (email: string) => {
    await api.api.authCodeCreate({ email })
  }

  const verifyCode = async (email: string, code: string) => {
    const response = await api.api.authCodeVerifyCreate({ email, code })
    const data = response.data as unknown as TokenRefresh

    accessToken.value = data.access
    refreshToken.value = data.refresh

    setTokens(accessToken.value, refreshToken.value)
    await fetchUser()
    saveState()
  }

  async function fetchUser() {
    if (!accessToken.value) return

    try {
      const response = await api.api.usersMeRetrieve()
      user.value = response.data as unknown as AuthUser
      saveState()
    } catch {
      console.error('Failed to fetch user')
    }
  }

  const updateUser = async (userData: PatchedUserRequest) => {
    if (!accessToken.value) {
      throw new Error('No access token')
    }

    try {
      const response = await api.api.usersMePartialUpdate(userData)
      user.value = response.data as unknown as AuthUser
      saveState()
      return response.data as unknown as { id: number; username: string }
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const refreshTokens = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      logout()
      return false
    }

    try {
      const response = await api.api.authTokenRefreshCreate({
        refresh: refreshToken.value,
        access: '',
      } as TokenRefresh)
      const data = response.data as unknown as TokenRefresh

      accessToken.value = data.access
      refreshToken.value = data.refresh || refreshToken.value

      setTokens(accessToken.value, refreshToken.value)
      saveState()
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    clearTokens()
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  loadState()

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    requestCode,
    verifyCode,
    logout,
    fetchUser,
    updateUser,
    refreshTokens,
    loadState,
  }
})
