/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const blogRouter = {
    path: '/blog',
    component: Layout,
    redirect: '/blog/article',
    name: 'Blog',
    meta: {
      title: '博客管理',
      icon: 'component'
    },
    children: [
      {
        path: '/blog/article',
        component: () => import('@/views/blog/article'),
        name: 'Article',
        meta: {
          title: '文章列表',
          icon: 'list'
        }
      },      
      {
        path: '/blog/article/create',
        component: () => import('@/views/blog/article/create'),
        name: 'CreateArticle',
        meta: { title: '创建文章', icon: 'edit' },
        hidden: true
      },
      {
        path: '/blog/article/edit/:id(\\d+)',
        component: () => import('@/views/blog/article/edit'),
        name: 'EditArticle',
        meta: { title: '编辑文章', noCache: true, activeMenu: '/blog/article' },
        hidden: true
      },
     {
        path: '/blog/category',
        component: () => import('@/views/blog/category'),
        name: 'Category',
        meta: {
        title: '分类管理',
        icon: 'role'
      }
      }//,
      // {
      //   path: '/blog/group',
      //   component: () => import('@/views/blog/group'),
      //   name: 'Group',
      //   meta: {
      //     title: '评论管理',
      //     icon: 'group'
      //   }
      // }
    ]

}


export default blogRouter
