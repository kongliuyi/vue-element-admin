import request from '@/utils/request'

export function queryMenu(data) {
  return request({
    url: '/api-admin/menu/conditions',
    method: 'post',
    data
  })
}

export function getMenu(id) {
  return request({
    url: '/api-admin/menu/' + id,
    method: 'get'
  })
}


export function getChildrenMenu(id) {
  return request({
    url: '/api-admin/menu/parent/' + id,
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/api-admin/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/api-admin/menu/' + data.id,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/api-admin/menu/' + id,
    method: 'delete'
  })
}

export function getAllMenu() {
  return request({
    url: '/api-admin/menu/all',
    method: 'get'
  })
}

export function refreshMenu() {
  return request({
    url: '/api-admin/menu/overload',
    method: 'post'
  })
}

