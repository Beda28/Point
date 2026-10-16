export const getToken = () => document.cookie
  .split('; ')
  .find((cookie) => cookie.startsWith('access_token='))
  ?.slice('access_token='.length)

export const setToken = (token: string) => {
  document.cookie = `access_token=${token}; Path=/; Max-Age=3600; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
}

export const clearToken = () => {
  document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax'
}

export const getUserId = (): string | undefined => {
  const token = getToken()
  if (!token) return
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof payload.sub === 'string' && payload.exp > Date.now() / 1000) return payload.sub
  } catch {
    return
  }
}
