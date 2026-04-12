<template>
  <div class="admin-page">
    <div class="page-header">
      <h3>Tất cả sách trong kho</h3>
      <SearchBar/>
      <button @click="openModal()" class="btn btn-primary">
        + Thêm sách mới
      </button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Số lượng</th>
          <th>Đơn giá</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in filteredBooks" :key="book._id">
          <td>{{ book.tenSach }}</td>
          <td>{{ book.tacGia }}</td>
          <td>{{ book.soQuyen }}</td>
          <td>{{ book.donGia.toLocaleString() }}đ</td>
          <td>
            <button @click="openModal(book)" class="btn-edit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
            <button @click="handleDelete(book._id)" class="btn-del">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4>{{ isEdit ? "Cập nhật sách" : "Thêm sách mới" }}</h4>

        <form @submit.prevent="saveBook">
          <div class="form-grid">
            <div class="form-group-full">
              <label class="form-label">Tên sách</label>
              <input
                v-model="bookForm.tenSach"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Tác giả</label>
              <input
                v-model="bookForm.tacGia"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Năm xuất bản</label>
              <input
                v-model.number="bookForm.namXuatBan"
                type="number"
                placeholder="YYYY"
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Số lượng</label>
              <input
                v-model.number="bookForm.soQuyen"
                type="number"
                required
                min="0"
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Đơn giá</label>
              <input
                v-model.number="bookForm.donGia"
                type="number"
                required
                min="0"
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Nhà xuất bản</label>
              <select v-model="bookForm.maNXB" required class="form-input">
                <option disabled value="">-- Chọn nhà xuất bản --</option>
                <option
                  v-for="pub in publishers"
                  :key="pub.maNXB"
                  :value="pub.maNXB"
                >
                  {{ pub.tenNXB }}
                </option>
              </select>
            </div>

            <div class="form-group-full">
              <label class="form-label">Link hình ảnh</label>
              <input
                v-model="bookForm.hinhAnh"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="form-input"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { bookService } from "../../services/bookService";
import SearchBar from "../../components/SearchBar.vue";
import {useRoute} from "vue-router";
import { publisherService } from "../../services/publisherService";

const books = ref([]);
const route = useRoute();
const publishers = ref([]);

const showModal = ref(false);
const isEdit = ref(false);

const initialForm = {
  tenSach: "",
  tacGia: "",
  donGia: 0,
  soQuyen: 10,
  maNXB: "",
  namXuatBan: 2026,
  hinhAnh: "",
};

const bookForm = ref({ ...initialForm });


const filteredBooks = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();
  
  if (!query) {
    return books.value;
  }

  return books.value.filter(
    (book) =>
      book.tenSach?.toLowerCase().includes(query) ||
      book.tacGia?.toLowerCase().includes(query) ||
      book.maSach?.toString().includes(query)
  );
});

const fetchData = async () => {
  try {
    const [booksRes, publishersRes] = await Promise.all([
      bookService.getAllBooks(),
      publisherService.getAllPublishers(), 
    ]);

    books.value = booksRes.data;
    publishers.value = publishersRes.data;

    console.log("Dữ liệu NXB đã tải:", publishers.value);
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu tổng hợp:", err);
    alert("Không thể tải dữ liệu");
  }
};

const openModal = (book = null) => {
  if (book) {
    isEdit.value = true;
    bookForm.value = { ...book };
  } else {
    isEdit.value = false;
    bookForm.value = { ...initialForm };
  }
  showModal.value = true;
};

const saveBook = async () => {
  try {
    if (isEdit.value) {
      await bookService.updateBook(bookForm.value._id, bookForm.value);
    } else {
      await bookService.createBook(bookForm.value);
    }
    showModal.value = false;
    fetchData(); 
    alert("Thao tác thành công!");
  } catch (err) {
    alert("Lỗi khi lưu dữ liệu!");
    console.error(err);
  }
};

const handleDelete = async (id) => {
  if (confirm("Xóa sách này?")) {
    try {
      await bookService.deleteBook(id);
      fetchData();
    } catch (err) {
      alert("Không thể xóa sách này!");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}
.form-group-full {
  grid-column: span 2;
}
</style>
