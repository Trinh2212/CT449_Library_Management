<template>
  <div class="auth-container">
    <form @submit.prevent="handleLogin" class="auth-form">
      <h2>Đăng nhập</h2>
      <div class="form-group">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="Nhập email của bạn"
        />
      </div>
      <div class="form-group">
        <label>Mật khẩu</label>
        <div class="input-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Nhập mật khẩu của bạn"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="password-toggle"
          >
            <span v-if="!showPassword">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </span>
            <span v-else>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <button type="submit" :disabled="loading">Đăng nhập</button>
      <p>
        Bạn chưa có tài khoản?
        <router-link to="/register" class="under"> Đăng ký ngay</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    console.log("Attempting login with:", { email: email.value });
    const res = await authService.login({
      email: email.value,
      password: password.value,
    });
    console.log("Login response:", res.data);

    if (!res.data.token) {
      alert("Lỗi: Không nhận được token từ server");
      return;
    }

    auth.setLogin(res.data);
    console.log("Auth store updated:", { token: auth.token, role: auth.role });
    alert("Đăng nhập thành công!");
    router.push("/");
  } catch (err) {
    console.error("Login error details:", {
      status: err.response?.status,
      message: err.response?.data?.message,
      fullError: err.message,
    });
    alert(err.response?.data?.message || "Đăng nhập thất bại: " + err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 12px;
  background-color: #1269b0;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
}

.under {
  color: #1269b0;
}

.under:hover {
  cursor: pointer;
  color: #022c4e;
  text-underline-offset: 4px;
  text-decoration: underline;
}

button:hover {
  cursor: pointer;
  background-color: #022c4e;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 10px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.password-toggle {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  padding: 0;
  width: auto;
  margin-top: 0;
  color: #666;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.password-toggle:hover {
  background: none;
  color: #1269b0;
}
</style>
