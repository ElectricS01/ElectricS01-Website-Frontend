import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/home",
    redirect: "/"
  },
  {
    path: "/tonkgame",
    name: "tonkgame",
    component: () => import("../views/TonkGame.vue")
  },
  {
    path: "/calculator",
    name: "calculator",
    component: () => import("../views/Calculator.vue")
  },
  {
    path: "/tetris",
    name: "tetris",
    component: () => import("../views/Tetris.vue")
  },
  {
    path: "/collider",
    name: "collider",
    component: () => import("../views/Collider.vue")
  },
  {
    path: "/user",
    redirect: "/chat/1"
  },
  {
    path: "/user/:id",
    name: "user",
    component: () => import("../views/BetterTest/Chat.vue")
  },
  {
    path: "/chat",
    redirect: "/chat/1"
  },
  {
    path: "/chat/:chatId",
    name: "chat",
    component: () => import("../views/BetterTest/Chat.vue")
  },
  {
    path: "/account/:id",
    name: "account",
    component: () => import("../views/BetterTest/Account.vue")
  },
  {
    path: "/account",
    redirect: "/account/account"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/BetterTest/Login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/BetterTest/Register.vue")
  },
  {
    path: "/reset",
    name: "reset",
    component: () => import("../views/BetterTest/Reset.vue")
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("../views/BetterTest/Verify.vue")
  },
  {
    path: "/:a",
    name: "404",
    component: () => import("../views/404.vue")
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
