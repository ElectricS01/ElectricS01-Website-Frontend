import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    component: () => import("./views/Home.vue"),
    name: "home",
    path: "/"
  },
  {
    path: "/home",
    redirect: "/"
  },
  {
    component: () => import("./views/Blog.vue"),
    name: "blog",
    path: "/blog",
    meta: {
      title: "ElectricS01's Blog"
    }
  },
  {
    component: () => import("./views/Blog/Blog.vue"),
    name: "first-post",
    path: "/blog/first-post",
    meta: {
      title: "Making a blog"
    }
  },
  {
    component: () => import("./views/TonkGame.vue"),
    name: "tonkgame",
    path: "/tonkgame",
    meta: {
      title: "TonkGame by ElectricS01"
    }
  },
  {
    component: () => import("./views/Calculator.vue"),
    name: "calculator",
    path: "/calculator",
    meta: {
      title: "ElectricS01's Calculator"
    }
  },
  {
    component: () => import("./views/Tetris.vue"),
    name: "tetris",
    path: "/tetris",
    meta: {
      title: "Tetris by ElectricS01"
    }
  },
  {
    component: () => import("./views/Collider.vue"),
    name: "collider",
    path: "/collider",
    meta: {
      title: "Collider by ElectricS01"
    }
  },
  {
    path: "/user",
    redirect: "/chat/1"
  },
  {
    component: () => import("./views/BetterTest/Chat.vue"),
    name: "user",
    path: "/user/:id"
  },
  {
    path: "/chat",
    redirect: "/chat/1"
  },
  {
    component: () => import("./views/BetterTest/Chat.vue"),
    name: "chat",
    path: "/chat/:chatId"
  },
  {
    component: () => import("./views/BetterTest/Account.vue"),
    name: "account",
    path: "/account/:id"
  },
  {
    path: "/account",
    redirect: "/account/account"
  },
  {
    component: () => import("./views/BetterTest/Login.vue"),
    name: "login",
    path: "/login"
  },
  {
    component: () => import("./views/BetterTest/Register.vue"),
    name: "register",
    path: "/register"
  },
  {
    component: () => import("./views/BetterTest/Reset.vue"),
    name: "reset",
    path: "/reset"
  },
  {
    component: () => import("./views/BetterTest/Verify.vue"),
    name: "verify",
    path: "/verify"
  },
  {
    component: () => import("./views/404.vue"),
    name: "404",
    path: "/:pathMatch(.*)*"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta?.title ?? "ElectricS01's Website"
})

export default router
