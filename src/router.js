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
    name: "blog",
    path: "/blog",
    children: [
      {
        name: "blog",
        path: "",
        component: () => import("./views/Blog.vue"),
        meta: {
          title: "ElectricS01's Blog"
        }
      },
      {
        name: "first-post",
        path: "first-post",
        component: () => import("./views/Blog/MyFirstBlogPost.vue"),
        meta: {
          title: "Making a blog"
        }
      },
      {
        name: "learning-rust",
        path: "learning-rust",
        component: () => import("./views/Blog/LearningRust.vue"),
        meta: {
          title: "Learning Rust"
        }
      }
    ]
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
    component: () => import("./views/BetterComms/Chat.vue"),
    name: "user",
    path: "/user/:id",
    meta: {
      title: "BetterComms"
    }
  },
  {
    path: "/chat",
    redirect: "/chat/1"
  },
  {
    component: () => import("./views/BetterComms/Chat.vue"),
    name: "chat",
    path: "/chat/:chatId",
    meta: {
      title: "BetterComms"
    }
  },
  {
    component: () => import("./views/BetterComms/Account.vue"),
    name: "account",
    path: "/account/:id",
    meta: {
      title: "Account Settings"
    }
  },
  {
    path: "/account",
    redirect: "/account/account"
  },
  {
    component: () => import("./views/BetterComms/Login.vue"),
    name: "login",
    path: "/login",
    meta: {
      title: "Login To BetterComms"
    }
  },
  {
    component: () => import("./views/BetterComms/Register.vue"),
    name: "register",
    path: "/register",
    meta: {
      title: "Register To BetterComms"
    }
  },
  {
    component: () => import("./views/BetterComms/Reset.vue"),
    name: "reset",
    path: "/reset",
    meta: {
      title: "Reset Your password"
    }
  },
  {
    component: () => import("./views/BetterComms/Verify.vue"),
    name: "verify",
    path: "/verify",
    meta: {
      title: "Verify Your Account"
    }
  },
  {
    component: () => import("./views/404.vue"),
    name: "404",
    path: "/:pathMatch(.*)*",
    meta: {
      title: "404: Page Not Found"
    }
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
