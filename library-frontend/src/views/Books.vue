<template>
  <div class="books-page">
    <div class="page-header">
      <h1>Tất cả sách</h1>
      
      <SearchBar variant="search-bar" />
      
    </div>

    <div v-if="loading" class="status-msg">Đang tải danh sách sách...</div>

    <div v-else-if="filteredBooks.length > 0" class="book-grid">
      <BookCard v-for="book in filteredBooks" :key="book._id" :book="book" />
      
    </div>

    <div v-else class="status-msg">
      <p>Không tìm thấy sách nào khớp với từ khóa "{{ route.query.q }}"</p>
      <button @click="resetSearch" class="btn btn-primary">Hiển thị tất cả sách</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { bookService } from "../services/bookService";
import BookCard from "../components/BookCard.vue";
import SearchBar from "../components/SearchBar.vue"; 

const route = useRoute();
const router = useRouter();

const books = ref([]);
const loading = ref(true);

const filteredBooks = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();
  
  if (!query) {
    return books.value;
  }

  return books.value.filter(
    (book) =>
      book.tenSach?.toLowerCase().includes(query) ||
      book.tacGia?.toLowerCase().includes(query)
  );
});


const fetchBooks = async () => {
  loading.value = true;
  try {
    const res = await bookService.getAllBooks();
    books.value = res.data;
    filterBooks(); 
    
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sách:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBooks);
</script>

<style scoped>
.books-page {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 970px;
  margin: 0 auto;
}

.status-msg {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #000;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
