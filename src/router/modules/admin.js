/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/user',
  name: 'admin',
  meta: {
    title: '系统管理',
    icon: 'component'
  },
  children: [
    {
      path: '/admin/user',
      component: () => import('@/views/admin/user'),
      name: 'User',
      meta: {
        title: '用户管理',
        icon: 'peoples'
      }
    }, {
      path: '/admin/resource',
      component: () => import('@/views/admin/resource'),
      name: 'Resource',
      meta: {
        title: '资源管理',
        icon: 'tree'
      }
    },
    {
      path: '/admin/role',
      component: () => import('@/views/admin/role'),
      name: 'Role',
      meta: {
        title: '角色管理',
        icon: 'role'
      }
    },
    {
      path: '/admin/group',
      component: () => import('@/views/admin/group'),
      name: 'Group',
      meta: {
        title: '组织架构',
        icon: 'group'
      }
    }, {
      path: '/admin/gateway',
      component: () => import('@/views/admin/gateway'),
      name: 'Gateway',
      meta: {
        title: '路由管理',
        icon: 'guide'
      }
    }
  ]
}

export default adminRouter
