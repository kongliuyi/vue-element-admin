import request from '@/utils/request'



export function searchArticle(data) {
  return request({
    url: '/api-blog/article/conditions',
    method: 'post',
    data
  })
}

export function getArticle(id) {
  return request({
    url: '/api-blog/article/' + id,
    method: 'get'
  })
}


export function createArticle(data) {
  return request({
    url: '/api-blog/article',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/api-blog/article/' + data.id,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/api-blog/article/' + id,
    method: 'delete'
  })
}
