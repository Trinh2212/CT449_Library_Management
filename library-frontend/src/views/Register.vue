<template>
  <div class="register-container">
    <h2 class="auth-title">Đăng Ký</h2>
    <p class="auth-subtitle">Nhập đầy đủ thông tin để đăng ký</p>

    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-grid">
        <div class="form-group full-width">
          <label for="email" class="form-label"
            >Email <span class="required">*</span></label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            required
            placeholder="test@gmail.com"
            class="form-input"
          />
          <p v-if="errorEmail" class="form-error">{{ errorEmail }}</p>
        </div>

        <div class="form-group">
          <label for="password" class="form-label"
            >Mật khẩu <span class="required">*</span></label
          >
          <div class="input-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              required
              autocomplete="off"
              placeholder="Tối thiểu 8 ký tự"
              class="form-input"
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
                  stroke="black"
                  width="24"
                  height="24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </span>
              <span v-else><svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="black"
                  width="24"
                  height="24"
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
                </svg></span>
            </button>
          </div>
          <p v-if="errorPassword" class="form-error">{{ errorPassword }}</p>
        </div>

        <div class="form-group">
          <label for="confirm" class="form-label"
            >Xác nhận mật khẩu <span class="required">*</span></label
          >
          <div class="input-wrapper">
            <input
              v-model="confirm"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm"
              required
              placeholder="Nhập lại mật khẩu"
              class="form-input"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
            >
              <span v-if="!showConfirmPassword">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="black"
                  width="24"
                  height="24"
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
                  stroke="black"
                  width="24"
                  height="24"
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
          <p v-if="errorConfirm" class="form-error">{{ errorConfirm }}</p>
        </div>

        <div class="form-group">
          <label for="hoLot" class="form-label"
            >Họ lót <span class="required">*</span></label
          >
          <input
            v-model="hoLot"
            type="text"
            id="hoLot"
            required
            autocomplete="off"
            placeholder="Nguyễn Văn"
            class="form-input"
          />
          <p v-if="errorHoLot" class="form-error">{{ errorHoLot }}</p>
        </div>

        <div class="form-group">
          <label for="ten" class="form-label"
            >Tên <span class="required">*</span></label
          >
          <input
            v-model="ten"
            type="text"
            id="ten"
            required
            autocomplete="off"
            placeholder="A"
            class="form-input"
          />
          <p v-if="errorTen" class="form-error">{{ errorTen }}</p>
        </div>

        <div class="form-group">
          <label for="ngaySinh" class="form-label">Ngày sinh</label>
          <input
            v-model="ngaySinh"
            type="date"
            id="ngaySinh"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="phai" class="form-label">Giới tính</label>
          <select v-model="phai" id="phai" class="form-input">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label for="dienThoai" class="form-label"
            >Số điện thoại <span class="required">*</span></label
          >
          <input
            v-model="dienThoai"
            type="tel"
            id="dienThoai"
            required
            placeholder="0912233344"
            class="form-input"
          />
        </div>

        <div class="form-group full-width">
          <label for="diaChi" class="form-label">Địa chỉ</label>
          <input
            v-model="diaChi"
            type="text"
            id="diaChi"
            placeholder="phường Ninh Kiều, TP Cần Thơ"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary btn-primary-wide"
          :disabled="loading"
        >
          {{ loading ? "Đang xử lý..." : "Đăng ký ngay" }}
        </button>
      </div>

      <p v-if="message" :class="messageType" class="form-message">
        {{ message }}
      </p>

      <p class="auth-footer">
        Bạn đã có tài khoản?
        <router-link to="/auth/login"> Đăng nhập ngay </router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { readerService } from "../services/readerService";
import { authService } from "../services/authService";
const router = useRouter();

const hoLot = ref("");
const ten = ref("");
const ngaySinh = ref("");
const diaChi = ref("");
const dienThoai = ref("");
const phai = ref("Nữ");

const email = ref("");
const password = ref("");
const confirm = ref("");

const message = ref("");
const messageType = ref("");
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errorHoLot = ref("");
const errorTen = ref("");
const errorEmail = ref("");
const errorPassword = ref("");
const errorConfirm = ref("");

const validateAll = () => {
  let isValid = true;
  errorEmail.value = errorPassword.value = errorConfirm.value = "";
  errorHoLot.value = errorTen.value = "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorEmail.value = "Email không hợp lệ.";
    isValid = false;
  }
  if (password.value.length < 8) {
    errorPassword.value = "Mật khẩu tối thiểu 8 ký tự.";
    isValid = false;
  }
  if (password.value !== confirm.value) {
    errorConfirm.value = "Mật khẩu xác nhận không khớp.";
    isValid = false;
  }
  if (!hoLot.value) {
    errorHoLot.value = "Họ lót không được để trống.";
    isValid = false;
  }
  if (!ten.value) {
    errorTen.value = "Tên không được để trống.";
    isValid = false;
  }
  return isValid;
};

const handleRegister = async () => {
  if (!validateAll()) {
    message.value = "Vui lòng kiểm tra lại thông tin đăng ký";
    messageType.value = "error";
    return;
  }

  loading.value = true;
  message.value = "Đang thực hiện...";
  messageType.value = "info";

  try {
    let formattedDate = ngaySinh.value;
    if (ngaySinh.value) {
      const [year, month, day] = ngaySinh.value.split("-");
      formattedDate = `${day}/${month}/${year}`;
    }

    const userRes = await readerService.createReader({
      hoLot: hoLot.value,
      ten: ten.value,
      ngaySinh: formattedDate,
      diaChi: diaChi.value,
      dienThoai: dienThoai.value,
      phai: phai.value,
    });

    const maDocGia = userRes.data.maDocGia;

    if (!maDocGia) throw new Error("Không nhận được mã độc giả từ hệ thống.");

    message.value = "Đang kích hoạt tài khoản...";

    await authService.register({
      email: email.value,
      password: password.value,
      maDocGia: maDocGia,
    });

    message.value = "Đăng ký thành công!";
    messageType.value = "success";

    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  } catch (err) {
    console.error(err);
    messageType.value = "error";
    message.value =
      err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 650px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.auth-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.auth-subtitle {
  text-align: center;
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: span 2; 
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.required {
  color: #e83622;
}

.form-input {
  padding: 12px;
  border: 1px solid #dcdde1;
  border-radius: 8px;
  font-size: 0.95rem;
}

.form-input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper .form-input {
  width: 100%;
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.form-actions {
  margin-top: 30px;
}

.btn-primary-wide {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary-wide:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.form-error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin: 0;
}

.form-message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.error {
  background-color: #fceaea;
  color: #c0392b;
  border: 1px solid #f5c6cb;
}

.success {
  background-color: #eafaf1;
  color: #27ae60;
  border: 1px solid #c3e6cb;
}

.info {
  background-color: #e8f4fd;
  color: #2980b9;
}

.auth-footer {
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #2f3334;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
  color: #022c4e;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
