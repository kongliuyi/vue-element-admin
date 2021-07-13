import request from '@/utils/request'



export function searchCategory(data) {
  return request({
    url: '/api-blog/category/conditions',
    method: 'post',
    data
  })
}

export function getCategory(id) {
  return request({
    url: '/api-blog/category/' + id,
    method: 'get'
  })
}


export function createCategory(data) {
  return request({
    url: '/api-blog/category',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/api-blog/category/' + data.id,
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/api-blog/category/' + id,
    method: 'delete'
  })
}
