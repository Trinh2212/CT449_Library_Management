<template>
  <div class="info-container" v-if="user">
    <div class="detail-grid">

      <div class="info-side">
        <h1>Thông tin cá nhân</h1>
        <p class="user-name">
          Họ và tên: 
          {{ user?.role === 'admin' ? (user.hoTenNV) : (user.fullName) }}
        </p>
        
        <div class="specs">
          <p>
            <span>{{user?.role === 'admin' ? 'mã số nhân viên' : 'mã độc giả'}}:</span> 
            <strong>{{ user.maDocGia || user.msnv }}</strong>
          </p>
          <p>
            <span>Email:</span> 
            {{ user.email || "Chưa cập nhật" }}
          </p>
          <p>
            <span>Số điện thoại:</span> 
            {{ user.dienThoai || "Chưa cập nhật" }}
          </p>
          <p>
            <span>Địa chỉ:</span> 
            {{ user.diaChi || "Chưa cập nhật" }}
          </p>
          <p v-if="user.ngaySinh">
            <span>Ngày sinh:</span> 
            {{ new Date(user.ngaySinh).toLocaleDateString('vi-VN') }}
          </p>
          <p v-if="user.chucVu">
            <span>Chức vụ:</span> 
            <span>{{ user.chucVu }}</span>
          </p>
        </div>

        <hr />

        <div class="actions">
          <button @click="$router.back()" class="btn btn-primary">Trở về trang chủ</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Đang tải thông tin người dùng...</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const user = ref(null);

onMounted(() => {
  // Lấy dữ liệu user từ store (đã lưu khi login)
  if (auth.user) {
    user.value = auth.user;
  } else {
    router.push("/login");
  }
});
</script>

<style scoped>
h1 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2rem;
}

.user-name {
  font-size: 1.2rem;
  color: #4e4e4e;
  margin-bottom: 25px;
}

.specs p {
  margin: 12px 0;
  font-size: 1.1rem;
  display: flex;
}

.specs span:first-child {
  width: 150px;
  color: #7f8c8d;
  flex-shrink: 0;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
}

</style>