<template>
  <div class="home">
    <HeroBanner />
    <section class="featured">
      <h2>Sách nổi bật</h2>
      <div class="book-grid">
        <BookCard v-for="book in books" :key="book._id" :book="book" />
      </div>
    </section>

    <section class="about-section about-section-alt">
      <div class="about-content about-content-reverse">
        <div class="about-image">
          <img
            src="https://images.unsplash.com/photo-1558901357-ca41e027e43a"
            alt="Người đọc sách trên thiết bị di động"
          />
        </div>
        <div class="about-text">
          <h3 class="about-title">Lắng nghe từng câu chuyện trong sách</h3>
          <p class="about-description">
            Khi thực sự đắm chìm trong những 
            trang sách chính là lúc bạn nhận ra 
            được giá trị thực sự của cuốn sách đó.
          </p>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/auth/register"
            class="cta-button"
          >
            Đăng Ký Miễn Phí
          </router-link>
        </div>
      </div>
    </section>

    <section class="blog-section">
      <h2>Góc động lực và cảm hứng đọc sách</h2>
      <div class="blog-grid">
        <div class="blog-card" v-for="blog in mockBlogs" :key="blog.id">
          <img :src="blog.image" :alt="blog.title" class="blog-image" />
          <div class="blog-content">
            <h3>{{ blog.title }}</h3>
            <p>{{ blog.summary }}</p>
            <router-link to="/books" class="read-more">Bắt đầu với những cuốn sách &rarr;</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { bookService } from "../services/bookService";
import BookCard from "../components/BookCard.vue";
import { borrowService } from "../services/borrowService";
import HeroBanner from "../components/HeroBanner.vue";

import { useAuthStore } from "../stores/auth"; 

const authStore = useAuthStore();
const books = ref([]);
const mockBlogs = ref([
  {
    id: 1,
    title: "Mỗi cuốn sách là một hành trình đầy ý nghĩa",
    image: "https://images.unsplash.com/photo-1610558495616-9ce40f904dde",
    summary: "Sách mở ra cánh cửa cho những giấc mơ mà bạn chưa từng nghĩ tới. – C.S. Lewis",
  },
  {
    id: 2,
    title: "Khai phá bản thân và thế giới qua những cuốn sách hay",
    image: "https://images.unsplash.com/photo-1599488059863-ac95a7f49193",
    summary: "Sách giúp tôi tìm thấy sức mạnh trong những lúc yếu đuối nhất. – Maya Angelou",
  },
]);

onMounted(async () => {
  try {
    const response = await bookService.getAllBooks();
    books.value = response.data.slice(0, 6);
  } catch (error) {
    console.error("Lỗi tải sách:", error);
  }
  
  try {
    const userStr = localStorage.getItem("user"); 
    if (!userStr) return; 
    
    const user = JSON.parse(userStr);
    const res = await borrowService.getAllBorrows(); 
  
    const myBorrows = res.data.filter(item => {
      const idFromBorrow = item.borrowerId?._id || item.borrowerId?.maDocGia || item.borrowerId;
      const roleFromBorrow = item.borrowerId?.role || (item.borrowerId?.msnv ? 'admin' : 'user');

      const idFromUser = user._id || user.maDocGia || user.msnv;
      const roleFromUser = user.role || (user.msnv ? 'admin' : 'user');
      const isSamePerson = (idFromBorrow === idFromUser) && (roleFromBorrow === roleFromUser);
      return isSamePerson;
    });
    const hasOverdue = myBorrows.some(item => {
      if (item.status !== "Đang mượn" || !item.hanTra) {
        return false;
      }

      const hanTraDate = new Date(item.hanTra);
      hanTraDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isLate = today > hanTraDate;
      return isLate; 
    });

    if (hasOverdue) {
      setTimeout(() => {
        alert("Bạn đang có sách mượn quá hạn chưa trả. Vui lòng đến thư viện trả để có thể tiếp tục mượn");
      }, 1000);
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra sách quá hạn:", error);
  }
});
</script>

<style scoped>
section {
  padding: 50px 0;
}
h2 {
  text-align: center;
  font-size: 2rem;
  color: #23384d;
  margin-bottom: 40px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.about-section {
  background-color: #ffffff;
}
.about-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}
.about-content-reverse {
  flex-direction: row-reverse;
}
.about-image {
  flex: 1;
}
.about-image img {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  max-height: 340px;
}
.about-text {
  flex: 1;
}
.about-title {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #1f5b97;
}
.about-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 30px;
}
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #1f5b97;
  color: white;
  padding: 12px 25px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}
.cta-button:hover {
  background-color: #033f7b;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(3, 63, 123, 0.3);
}
.cta-button svg {
  width: 20px;
  height: 20px;
}

.blog-section {
  background-color: #fff; 
}
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}
.blog-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}
.blog-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}
.blog-content {
  padding: 25px;
}
.blog-content h3 {
  font-size: 1.25rem;
  color: #23384d;
  margin: 0 0 15px 0;
  line-height: 1.4;
}
.blog-content p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
}
.read-more {
  color: #1f5b97;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
}
.read-more:hover {
  color: #033f7b;
}

@media (max-width: 768px) {
  .about-content {
    flex-direction: column;
    text-align: center;
  }
  .about-content-reverse {
    flex-direction: column;
  }
  .about-title {
    font-size: 1.8rem;
  }
}
</style>