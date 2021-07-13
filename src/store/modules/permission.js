import { asyncRoutes, constantRoutes } from '@/router'
import { getAllMenu } from '@/api/admin/menu'
import Layout from '@/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

let btns = new Map()
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if(tmp.type === '3'){
        // tmp.name + ':' + tmp.path = 存按钮代码
        btns.set(tmp.name + ':' + tmp.path, tmp.meta)
        // btns.push(tmp.name + ':' + tmp.path)
        return
      }
      tmp.component = loadView(tmp.component)
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
export function loadView(view) {
  // Layout 组件特殊处理
  if (view === 'Layout') {
    return Layout
  } else {
  // return (resolve) => require([`@/views${view}`], resolve)
    return (resolve) => require([`@/views${view}`], resolve)
  }
}

const state = {
  routes: [],
  addRoutes: [],
  btns: ''
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BTNS: (state, btns) => {
    state.btns = btns
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getAllMenu().then(response => {
        btns = new Map()
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(response.data, roles)
        }
        console.log('accessedRoutes', accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
       // let btns = ['menu:add','menu:search']
        commit('SET_BTNS', btns)
        resolve(accessedRoutes)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
