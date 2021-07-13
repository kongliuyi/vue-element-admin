import request from '@/utils/request'

export function queryDict(data) {
  return request({
    url: '/api-admin/dict/conditions',
    method: 'post',
    data
  })
}

export function getDict(id) {
  return request({
    url: '/api-admin/dict/' + id,
    method: 'get'
  })
}

export function getDictByCodes(data) {
  return request({
    url: '/api-admin/dict/codes/' + data,
    method: 'get'
  })
}

export function createDict(data) {
  return request({
    url: '/api-admin/dict',
    method: 'post',
    data
  })
}

export function updateDict(data) {
  return request({
    url: '/api-admin/dict/' + data.id,
    method: 'put',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: '/api-admin/dict/' + id,
    method: 'delete'
  })
}
