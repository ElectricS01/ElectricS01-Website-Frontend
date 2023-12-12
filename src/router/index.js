import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    component: () => import("../views/Home.vue"),
    name: "home",
    path: "/"
  },
  {
    path: "/home",
    redirect: "/"
  },
  {
    component: () => import("../views/TonkGame.vue"),
    name: "tonkgame",
    path: "/tonkgame"
  },
  {
    component: () => import("../views/Calculator.vue"),
    name: "calculator",
    path: "/calculator"
  },
  {
    component: () => import("../views/Tetris.vue"),
    name: "tetris",
    path: "/tetris"
  },
  {
    component: () => import("../views/Collider.vue"),
    name: "collider",
    path: "/collider"
  },
  {
    path: "/user",
    redirect: "/chat/1"
  },
  {
    component: () => import("../views/BetterTest/Chat.vue"),
    name: "user",
    path: "/user/:id"
  },
  {
    path: "/chat",
    redirect: "/chat/1"
  },
  {
    component: () => import("../views/BetterTest/Chat.vue"),
    name: "chat",
    path: "/chat/:chatId"
  },
  {
    component: () => import("../views/BetterTest/Account.vue"),
    name: "account",
    path: "/account/:id"
  },
  {
    path: "/account",
    redirect: "/account/account"
  },
  {
    component: () => import("../views/BetterTest/Login.vue"),
    name: "login",
    path: "/login"
  },
  {
    component: () => import("../views/BetterTest/Register.vue"),
    name: "register",
    path: "/register"
  },
  {
    component: () => import("../views/BetterTest/Reset.vue"),
    name: "reset",
    path: "/reset"
  },
  {
    component: () => import("../views/BetterTest/Verify.vue"),
    name: "verify",
    path: "/verify"
  },
  {
    component: () => import("../views/404.vue"),
    name: "404",
    path: "/:a"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
