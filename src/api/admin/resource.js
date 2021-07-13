import request from '@/utils/request'

export function queryResource(data) {
  return request({
    url: '/api-admin/resource/conditions',
    method: 'post',
    data
  })
}

export function getResource(id) {
  return request({
    url: '/api-admin/resource/' + { id },
    method: 'get'
  })
}

export function queryAllResource() {
  return request({
    url: '/api-admin/resource/all',
    method: 'get'
  })
}

export function createResource(data) {
  return request({
    url: '/api-admin/resource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: '/api-admin/resource/' + data.id,
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: '/api-admin/resource/' + id,
    method: 'delete'
  })
}

