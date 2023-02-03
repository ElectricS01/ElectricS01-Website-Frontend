import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue")
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
    path: "/test",
    name: "test",
    component: () => import("../views/BetterTest/Test.vue")
  },
  {
    path: "/account",
    name: "account",
    component: () => import("../views/BetterTest/Account.vue")
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
    path: "/:a",
    name: "404",
    component: () => import("../views/404.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
