<template>
  <div class="info-container" v-if="book">
    <div class="detail-grid">
      <div class="image-side">
        <img
          :src="book.hinhAnh || 'https://via.placeholder.com/300x450'"
          :alt="book.tenSach"
        />
      </div>
      <div class="info-side">
        <h1>{{ book.tenSach }}</h1>
        <p class="author">
          Tác giả: <strong>{{ book.tacGia }}</strong>
        </p>
        <div class="specs">
          <p>
            <span>Giá sách:</span>
            <span class="price">{{ book.donGia ? book.donGia.toLocaleString()  +"đ" : "giá chưa cập nhật"}}</span>
          </p>
          <p><span>Số sách còn lại:</span> {{ book.soQuyen }} quyển</p>
          <p><span>Năm xuất bản:</span> {{ book.namXuatBan }}</p>
        </div>
        <hr />
        <div class="actions">
          <button
            @click="handleBorrow"
            class="btn btn-primary"
            :disabled="book.soQuyen <= 0"
          >
            {{ book.soQuyen > 0 ? "Đăng kí mượn sách" : "Hết sách" }}
          </button>
          <button @click="$router.back()" class="btn btn-primary">Quay lại</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Đang tải thông tin sách...</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { bookService } from "../services/bookService";
import { borrowService } from "../services/borrowService";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const book = ref(null);

onMounted(async () => {
  try {
    const res = await bookService.getBookByMaSach(route.params.maSach);
    book.value = res.data;
  } catch (err) {
    alert("Không tìm thấy sách!");
    router.push("/books");
  }
});

const handleBorrow = async () => {
  if (!confirm(`Xác nhận gửi yêu cầu mượn quyển "${book.value.tenSach}"`)) return;
  try {
    const borrowData = {
      borrowerId: auth.user.maDocGia || auth.user.msnv,
      onModel: auth.role === "admin" ? "Staff" : "User",
      bookId: book.value.maSach,
      // ngayTra: new Date(new Date().setDate(new Date().getDate() + 7)),
    };
    await borrowService.createBorrow(borrowData);
    alert("Đăng ký mượn thành công!");
    // router.push("/my-borrows");
    if (book.value.soQuyen > 0) {
      book.value.soQuyen -= 1; 
    }
  } catch (err) {
    alert(err.response?.data?.message || "Có lỗi rồi, thực hiện lại sau nhe");
  }
};

</script>

<style scoped>

.image-side img {
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}
.author {
  font-size: 1.2rem;
  color: #4e4e4e;
  margin-bottom: 20px;
}
.specs p {
  margin: 10px 0;
  font-size: 1.1rem;
}
.specs span:first-child {
  width: 150px;
  display: inline-block;
}
.price {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.3rem;
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

</style>
