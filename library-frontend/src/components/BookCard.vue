<template>
  <div class="book-card">
    <img
      :src="book.hinhAnh || 'https://img.freepik.com/vector-cao-cap/cuon-sach-mo-va-dau-cham-hoi_594089-1679.jpg'"
      :alt="`Bìa sách của ${book.tenSach}`"
      class="book-image"
    />
    <div class="book-info">
      <h3 class="book-title">{{ book.tenSach }}</h3>
      <p class="book-author">Tác giả: {{ book.tacGia }}</p>
      <p class="book-price">Giá: {{ book.donGia ? book.donGia.toLocaleString()  +"đ" : "giá chưa cập nhật" }}</p>
      <router-link
        :to="`/books/masach/${book.maSach}`"
        class="btn-detail btn-primary"
      >
        Chi tiết sách
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps(["book"]);
</script>

<style scoped>
.book-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s;
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.book-card img {
  width: 100%;
  height: 280px;
  object-fit: contain;
  padding: 10px;
  box-sizing: border-box;
}
.book-info {
  padding: 5px;
  text-align: center;
}
.book-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em; 
}
.book-price {
  color: var(--danger-color);
  font-weight: bold;
}
.btn-detail {
  display: block;
  text-align: center;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 10px;
}
</style>
