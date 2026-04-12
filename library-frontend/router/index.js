import { createRouter, createWebHistory } from "vue-router";

import Home from "../src/views/Home.vue";
import NotFound from "../src/views/NotFound.vue";
import Register from "../src/views/Register.vue";
import Login from "../src/views/Login.vue";
import Books from "../src/views/Books.vue";
import BookInfo from "../src/views/BookInfo.vue";
import MyBorrows from "../src/views/MyBorrows.vue";
import UserInfo from "../src/views/UserInfo.vue";

import Dashboard from "../src/views/admin/Dashboard.vue";
import Content from "../src/views/admin/Content.vue";
import Users from "../src/views/admin/Users.vue";
import Borrows from "../src/views/admin/Borrows.vue";
import Publishers from "../src/views/admin/Publishers.vue";
import Staffs from "../src/views/admin/Staffs.vue";

import MainLayout from "../src/layouts/MainLayout.vue";
import AuthLayout from "../src/layouts/AuthLayout.vue";
import AdminLayout from "../src/layouts/AdminLayout.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: Home, name: "Home" },
      { path: "books", component: Books, name: "Books" },
      {
        path: "books/masach/:maSach",
        component: BookInfo,
        name: "BookInfo",
        meta: { requiresAuth: true },
      },
      {
        path: "user-info",
        component: UserInfo,
        name: "UserInfo",
        meta: { requiresAuth: true },
      },
      {
        path: "my-borrows",
        component: MyBorrows,
        name: "MyBorrows",
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "login", component: Login, name: "Login" },
      { path: "register", component: Register, name: "Register" },
    ],
  },

  // Redirect shortcuts
  { path: "/login", redirect: "/auth/login" },
  { path: "/register", redirect: "/auth/register" },

  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "content",
        name: "Content",
        component: Content,
      },
      {
        path: "publishers",
        name: "Publishers",
        component: Publishers,
      },
      {
        path: "users",
        name: "Users",
        component: Users,
      },
      {
        path: "staffs",
        name: "Staffs",
        component: Staffs,
      },
      {
        path: "borrows",
        name: "Borrows",
        component: Borrows,
      },
    ],
  },

  {
    path: "/:catchAll(.*)",
    component: NotFound,
    name: "NotFound",
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // Luôn cuộn lên đầu trang khi điều hướng
    return { top: 0 };
  },
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1. Kiểm tra route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !token) {
    // Nếu yêu cầu đăng nhập mà không có token -> về trang Login
    return next({ name: "Login" });
  }

  // 2. Kiểm tra route yêu cầu quyền admin
  if (to.meta.requiresAdmin && role !== "admin") {
    // Nếu yêu cầu quyền admin mà role không phải 'admin' -> cảnh báo và về trang Home
    alert("Bạn không có quyền truy cập vào trang này!");
    return next({ name: "Home" });
  }

  // Nếu tất cả điều kiện đều qua, cho phép truy cập
  next();
});

export default router;
