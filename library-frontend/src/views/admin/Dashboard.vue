<template>
  <div class="dashboard">
    <h2>Số Liệu Thống Kê</h2>
    <div class="stat-cards">
      <div class="card">
        <h3>Tổng số sách</h3>
        <p class="number">{{ stats.books }}</p>
      </div>
      <div class="card">
        <h3>Tổng số độc giả</h3>
        <p class="number">{{ stats.users }}</p>
      </div>
      <div class="card">
        <h3>Tổng số NXB</h3>
        <p class="number">{{ stats.publishers }}</p>
      </div>
      <div class="card">
        <h3>Tổng số đang mượn</h3>
        <p class="number">{{ stats.borrows }}</p>
      </div>
      <div class="card">
        <h3>Số yêu cầu chưa duyệt</h3>
        <p class="number">{{ stats.pendingRequests }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import api from "../../services/api";

const stats = reactive({
  books: 0,
  users: 0,
  borrows: 0,
  publishers: 0,
  pendingRequests: 0,
});

onMounted(async () => {
  const [book, user, borrow, publisher] = await Promise.all([
    api.get("/library/books"),
    api.get("/management/readers"),
    api.get("/library/borrows"),
    api.get("/library/publishers"),
  ]);
  stats.books = book.data.length;
  stats.users = user.data.length;
  stats.borrows = borrow.data.filter((x) => x.status === 'Đang mượn').length;
  stats.publishers = publisher.data.length;
  stats.pendingRequests = borrow.data.filter((x) => x.status === 'Chờ duyệt').length;
});
</script>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}
.card {
  background: rgb(255, 255, 255);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 10px;
}
</style>
