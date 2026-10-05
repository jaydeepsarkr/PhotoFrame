import { createRouter, createWebHistory } from 'vue-router'

import CustomerLayout from '@/layouts/CustomerLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Customer Views
import Home from '@/views/customer/Home.vue'
import Frames from '@/views/customer/Frames.vue'
import FrameDetails from '@/views/customer/FrameDetails.vue'
import Customize from '@/views/customer/Customize.vue'
import Cart from '@/views/customer/Cart.vue'
import Checkout from '@/views/customer/Checkout.vue'
import OrderReview from '@/views/customer/OrderReview.vue'
import OrderSuccess from '@/views/customer/OrderSuccess.vue'

import store from '@/store'

// Admin Views
import AdminLogin from '@/views/admin/Login.vue'
import AdminSignup from '@/views/admin/Signup.vue'
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminFrames from '@/views/admin/Frames.vue'
import AdminAddFrame from '@/views/admin/AddFrame.vue'
import AdminDesigns from '@/views/admin/Designs.vue'
import AdminAddDesign from '@/views/admin/AddDesign.vue'
import AdminOrders from '@/views/admin/Orders.vue'
import AdminOrderDetails from '@/views/admin/OrderDetails.vue'
import AdminSettings from '@/views/admin/Settings.vue'
import AdminSections from '@/views/admin/Sections.vue'
import AdminFooter from '@/views/admin/FooterSettings.vue'

const routes = [
  {
    path: '/',
    component: CustomerLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'frames',
        name: 'Frames',
        component: Frames
      },
      {
        path: 'frames/:id',
        name: 'FrameDetails',
        component: FrameDetails
      },
      {
        path: 'customize',
        redirect: '/customize/1'
      },
      {
        path: 'customize/:id',
        name: 'Customize',
        component: Customize
      },
      {
        path: 'cart',
        name: 'Cart',
        component: Cart
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: Checkout
      },
      {
        path: 'order-review',
        name: 'OrderReview',
        component: OrderReview
      },
      {
        path: 'order-success/:id',
        name: 'OrderSuccess',
        component: OrderSuccess
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/signup',
    name: 'AdminSignup',
    component: AdminSignup
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'frames',
        name: 'AdminFrames',
        component: AdminFrames
      },
      {
        path: 'frames/add',
        name: 'AdminAddFrame',
        component: AdminAddFrame
      },
      {
        path: 'designs',
        name: 'AdminDesigns',
        component: AdminDesigns
      },
      {
        path: 'designs/add',
        name: 'AdminAddDesign',
        component: AdminAddDesign
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders
      },
      {
        path: 'customers',
        name: 'AdminCustomers',
        redirect: '/admin/orders?tab=customers'
      },
      {
        path: 'orders/:id',
        name: 'AdminOrderDetails',
        component: AdminOrderDetails
      },
      {
        path: 'sections',
        name: 'AdminSections',
        component: AdminSections
      },
      {
        path: 'footer',
        name: 'AdminFooter',
        component: AdminFooter
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: AdminSettings
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

// Navigation Guard: Protect /admin routes with JWT authentication
router.beforeEach((to, from, next) => {
  const token =
    store.getters['auth/isAuthenticated'] ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('framevue_admin_token'))

  if (to.path.startsWith('/admin')) {
    // If going to login or signup page
    if (to.path === '/admin/login' || to.path === '/admin/signup') {
      if (token) {
        return next('/admin')
      }
      return next()
    }

    // If going to any protected admin route without token
    if (!token) {
      return next({
        path: '/admin/login',
        query: { redirect: to.fullPath }
      })
    }
  }

  next()
})

export default router
