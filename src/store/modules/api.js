const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 注册中心
    nacosServer: 'http://106.14.47.185:8848/nacos',
    sentinelDashboard: 'http://106.14.47.185:8021',
    mossServer: 'http://106.14.47.185:8022',
    // swagger
    swaggerApi: baseUrl + '/doc.html'
  }
}

export default api
