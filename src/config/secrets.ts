import { nanoid } from 'nanoid'
const DEFAULT_REFRESH_TOKEN_LENGTH = 64
const DEFAULT_JWT_LIFETIME_SEC = 3600
const DEFAULT_JWT_ISSUER = 'poke-default'
const DEFAULT_CLIENT_ID = 'default'

export const JWT_KEY = (() => {
  const envJwtKey = process.env.VITE_JWT_KEY
  if (!envJwtKey) {
    console.warn('Environment VITE_JWT_KEY key not found, using nanoid')
    return nanoid(20)
  } else {
    return envJwtKey
  }
})()

export const JWT_KEY_ISSUER = (() => {
  const jwtIssuer = process.env.VITE_JWT_KEY_ISSUER
  if (!jwtIssuer) {
    console.warn(
      'Environment VITE_JWT_KEY_ISSUER key not found, using',
      DEFAULT_JWT_ISSUER,
    )
    return DEFAULT_JWT_ISSUER
  }
  return jwtIssuer
})()

export const REFRESH_TOKEN_LENGTH = (() => {
  const refreshTokenLength = process.env.VITE_REFRESH_TOKEN_LENGTH
  const parsed = parseInt(refreshTokenLength)
  if (!refreshTokenLength || Number.isNaN(parsed)) {
    console.warn(
      'Environment VITE_REFRESH_TOKEN_LENGTH key not found or invalid, using',
      DEFAULT_REFRESH_TOKEN_LENGTH,
    )
    return DEFAULT_REFRESH_TOKEN_LENGTH
  } else {
    return parsed || DEFAULT_REFRESH_TOKEN_LENGTH
  }
})()

export const JWT_LIFETIME_SEC = (() => {
  const refreshTokenLength = process.env.VITE_JWT_LIFETIME_SEC
  const parsed = parseInt(refreshTokenLength)
  if (!refreshTokenLength || Number.isNaN(parsed)) {
    console.warn(
      'Environment VITE_JWT_LIFETIME_SEC key not found or invalid, using',
      DEFAULT_JWT_LIFETIME_SEC,
    )
    return DEFAULT_JWT_LIFETIME_SEC
  } else {
    return parsed || DEFAULT_JWT_LIFETIME_SEC
  }
})()

export const CONTEXT_FALLBACK_CLIENT_ID = (() => {
  const fallbackClientId = process.env.VITE_FALLBACK_CLIENT_ID
  if (!fallbackClientId) {
    return DEFAULT_CLIENT_ID
  }
  return fallbackClientId
})()

export const AWS_ACCESS_KEY = process.env.VITE_AWS_ACCESS_KEY

export const AWS_SECRET_KEY = process.env.VITE_AWS_SECRET_KEY

export const AWS_SERVER = process.env.VITE_AWS_SERVER

export const AWS_BUCKET = process.env.VITE_AWS_BUCKET

export const AWS_SSL_ENABLED = process.env.VITE_AWS_SSL_ENABLED === 'true'
