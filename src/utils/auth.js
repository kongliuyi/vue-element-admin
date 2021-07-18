import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const RefreshTokenKey = 'Admin-Refresh-Token'

const ExpireTimeTokenKey = 'Admin-expire-Time-Token'

export function setAuthentication(authentication) {
  console.log('authentication', authentication)
  var expireTime = new Date()
  // 提前 5 秒到期
  expireTime.setTime(expireTime.getTime() + (authentication.expires_in - 5) * 1000)
  return Cookies.set(TokenKey, authentication.access_token) && Cookies.set(RefreshTokenKey, authentication.refresh_token) && Cookies.set(ExpireTimeTokenKey, authentication.expires_in, expireTime)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken)
}

export function getExpireTimeToken() {
  return Cookies.get(ExpireTimeTokenKey)
}
