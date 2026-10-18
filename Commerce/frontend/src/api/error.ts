import { isAxiosError } from 'axios'

export const errorMessage = (error: unknown, fallback: string) => {
  const message = isAxiosError(error) && error.response?.data?.message
  return Array.isArray(message) ? message.join('\n') : typeof message === 'string' ? message : fallback
}
