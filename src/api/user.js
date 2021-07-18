import request from '@/utils/request'

export function login(data) {
  const form = {
    username: data.username,
    password: data.password,
    grant_type: 'password',
    scope: 'read'
  }
  return request({
    url: '/authorization-server/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
    },
    method: 'post',
    params: form
  })
}

export function getInfo(token) {
  return request({
    url: '/api-admin/user/current',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/authorization-server/oauth/logout',
    method: 'get'
  })

  // return Promise.resolve({
  //   code: "000000",
  //   mesg: "成功",
  //   time: new Date(),
  // })
}
