<template>
  <header class="header">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <img src="/img/logo.png" alt="Logo" class="logo-img" />
        <span class="logo-text">THƯ VIỆN CHÚNG MÌNH</span>
      </router-link>

      <button
        class="hamburger"
        @click="toggleMenu"
        :class="{ 'is-active': isMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="nav-links" :class="{ show: isMenuOpen }">
        <router-link to="/" @click="closeMenu" class="nav-item"
          >Trang chủ</router-link
        >
        <router-link to="/books" @click="closeMenu" class="nav-item"
          >Sách</router-link
        >
        <div class="header-search" v-if="route.path === '/'">
          <SearchBar variant="header" />
        </div>

        <template v-if="auth.token">
          <router-link to="/my-borrows" @click="closeMenu" class="nav-item"
            >Lịch sử mượn</router-link
          >
          <router-link
            v-if="auth.role === 'admin'"
            to="/admin"
            class="nav-item admin-link"
            @click="closeMenu"
            >Quản Lý</router-link
          >
          <div class="user-menu">
            <div class="user-info" @click="toggleDropdown">
              <span class="user-name">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="red"
                  width="24"
                  height="24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
              <span class="dropdown-icon" :class="{ rotate: isDropdownOpen }"
                >▼</span
              >
            </div>

            <div class="dropdown-content" v-show="isDropdownOpen">
              <router-link
                to="/user-info"
                class="dropdown-item"
                @click="closeMenu"
                >Thông tin cá nhân</router-link
              >
              <button @click="handleLogout" class="dropdown-item btn-logout">
                Đăng xuất
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" @click="closeMenu" class="btn-login"
            >Đăng nhập</router-link
          >
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";
import SearchBar from "./SearchBar.vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
  isDropdownOpen.value = false;
};

const handleLogout = () => {
  closeMenu();
  auth.logout();
  router.push("/login");
};
</script>

<style scoped>
.header {
  background-color: #23384d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 15px 0;
}
.header-search {
  order: 2;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  width: 40px;
  height: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-item {
  text-decoration: none;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 500;
  transition: color 0.3s ease;
  order: 1;
  white-space: nowrap;
}

.btn-login {
  order: 4;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #5caaea;
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  padding: 8px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.user-menu {
  position: relative;
  order: 3;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 15px;
  border-left: 1px solid #ccc;
  cursor: pointer;
}

.dropdown-icon {
  font-size: 0.7rem;
  color: #95a5a6;
  transition: transform 0.3s ease;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 140%;
  right: 0;
  background-color: white;
  min-width: 180px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 101;
}

.dropdown-item {
  padding: 12px 16px;
  text-decoration: none;
  color: #2c3e50;
  font-size: 0.95rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #1269b0;
}

.btn-logout {
  color: var(--danger-color);
}

.btn-logout:hover {
  background-color: #f8f9fa;
  color: #d92f1c;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #fff;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-item {
    color: #000;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: auto;
    right: -100%;
    width: 260px;
    height: 100vh;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 20px;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1); 
    transition: right 0.3s ease;
    opacity: 1;
  }

  .nav-links.show {
    right: 0;
  }

  .user-menu {
    width: 100%;
  }

  .user-info {
    display: flex !important;
    flex-direction: row !important; 
    justify-content: flex-start !important; 
    align-items: center !important;
    padding: 10px 0px !important; 
    margin: 0 !important;
    border: none !important;
    width: 100%;
    gap: 8px;
  }

  .dropdown-content {
    position: static;
    box-shadow: none;
    background-color: transparent;
    margin-top: 15px;
    padding-left: 15px;
  }

  .dropdown-item {
    text-align: left;
    padding: 10px 0;
  }

  .header-search {
    width: 100%;
  }
}
</style>