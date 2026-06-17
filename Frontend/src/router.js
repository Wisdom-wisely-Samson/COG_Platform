import { createRouter, createWebHistory } from 'vue-router'
import LoginView       from './views/LoginView.vue'
import DashboardLayout from './views/DashboardLayout.vue'
import DashboardView   from './views/DashboardView.vue'
import TaskBoardView   from './views/TaskBoardView.vue'
import PRMediaView     from './views/PRMediaView.vue'
import DigitalView     from './views/DigitalView.vue'
import CreativeView    from './views/CreativeView.vue'
import AdminOpsView    from './views/AdminOpsView.vue'
import AnalyticsView   from './views/AnalyticsView.vue'
import UsersView       from './views/UsersView.vue'
import { getUser }     from './users.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',      redirect: '/login' },
    { path: '/login', component: LoginView, meta: { public: true } },

    {
      path: '/',
      component: DashboardLayout,
      meta: { public: false },
      children: [
        // Admin-only pages
        { path: '/dashboard', component: DashboardView,  meta: { adminOnly: true  } },
        { path: '/taskboard', component: TaskBoardView,  meta: { adminOnly: true  } },
        { path: '/analytics', component: AnalyticsView,  meta: { adminOnly: true  } },
        { path: '/users',     component: UsersView,       meta: { adminOnly: true  } },
        // Department pages — visible to admin + matching-dept staff
        { path: '/pr',        component: PRMediaView,    meta: { dept: '/pr'       } },
        { path: '/digital',   component: DigitalView,    meta: { dept: '/digital'  } },
        { path: '/creative',  component: CreativeView,   meta: { dept: '/creative' } },
        { path: '/admin',     component: AdminOpsView,   meta: { dept: '/admin'    } },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach((to) => {
  const authed = sessionStorage.getItem('c1_auth') === '1'

  // Already logged in — skip login page
  if (to.path === '/login' && authed) {
    const user = getUser()
    return user?.role === 'admin' ? '/dashboard' : user?.dept ?? '/login'
  }

  // Not logged in — block everything protected
  if (!to.meta.public && !authed) return '/login'

  if (authed) {
    const user = getUser()
    if (!user) return '/login'

    // Staff trying to access admin-only pages
    if (to.meta.adminOnly && user.role !== 'admin') return user.dept

    // Staff trying to access another dept's page
    if (to.meta.dept && user.role !== 'admin' && user.dept !== to.meta.dept) return user.dept
  }

  return true
})

export default router
