import axios from 'axios'
import { clearToken, getToken } from './token'

const client = axios.create({
  baseURL: '/api',
})

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && getToken() && !['/auth/login', '/auth/register'].includes(error.config?.url)) {
    clearToken()
    alert('로그인이 만료되었습니다. 다시 로그인해주세요.')
    window.location.assign('/login')
  }
  return Promise.reject(error)
})

export default client
