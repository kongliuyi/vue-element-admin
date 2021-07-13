import request from '@/utils/request'

export function queryUser(data) {
  return request({
    url: '/api-admin/user/conditions',
    method: 'post',
    data
  })
}

export function getUser(id) {
  return request({
    url: '/api-admin/user/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/api-admin/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api-admin/user/' + data.id,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/api-admin/user/' + id,
    method: 'delete'
  })
}
