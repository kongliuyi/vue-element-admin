import request from '@/utils/request'

export function fetchGroupByParentId(id) {
  return request({
    url: '/api-admin/group/parent/' + id,
    method: 'get'
  })
}

export function getGroup(id) {
  return request({
    url: '/api-admin/group/' + id,
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: '/api-admin/group',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/api-admin/group/' + data.id,
    method: 'put',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: '/api-admin/group/' + id,
    method: 'delete'
  })
}

