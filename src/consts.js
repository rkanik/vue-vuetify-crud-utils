export const _isDev = process.env.NODE_ENV === 'development'
export const _isProd = !_isDev

export const _baseURL = process.env.BASE_URL

export const _msIn = (() => {
  let sec = 1000
  let min = sec * 60
  let hour = min * 60
  let day = hour * 24
  let week = day * 7
  let month = day * 30
  let year = day * 365
  return {
    sec, min, hour,
    day, week, month, year
  }
})()

export const _localServer = process.env.VUE_APP_LOCAL_SERVER
export const _remoteServer = process.env.VUE_APP_REMOTE_SERVER
export const _serverBaseURL = _isDev ? _localServer : _remoteServer

// Regex
export const _regex = {
  name: /^[a-zA-Z ]{3,32}$/,
  // eslint-disable-next-line no-useless-escape
  email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
  phone: /^(\+?[0-9]{11,13})$/,
  password: /^[a-zA-Z0-9]{8,20}$/,
  character: /^[a-zA-Z]+$/
}

// errors
export const _networkError = 'Network Error'