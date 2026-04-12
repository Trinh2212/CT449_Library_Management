<template>
  <div class="admin-page">
    <div class="page-header">
      <h3>Danh sách Độc giả</h3>
      <SearchBar />
      </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Họ Tên</th>
          <th>Điện thoại</th>
          <th>Địa chỉ</th>
          <th>Giới tính</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id || user.id">
          <td>{{ user.hoLot }} {{ user.ten }}</td>
          <td>{{ user.dienThoai || 'Chưa cập nhật' }}</td>
          <td>{{ user.diaChi || 'Chưa cập nhật' }}</td>
          <td>{{ user.phai }}</td>
          <td>
            <button @click="openModal(user)" class="btn-edit">
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
            <button @click="deleteUser(user.id || user._id)" class="btn-del">
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
        <h4>Cập nhật thông tin độc giả</h4>

        <form @submit.prevent="saveUser">
          <div class="form-grid">
            <div class="form-group-full">
              <label class="form-label">Mã độc giả (Mã ĐG)</label>
              <input
                v-model="userForm.maDocGia"
                type="text"
                disabled
                class="form-input disabled-input"
              />
            </div>

            <div>
              <label class="form-label">Họ lót</label>
              <input
                v-model="userForm.hoLot"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Tên</label>
              <input
                v-model="userForm.ten"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Số điện thoại</label>
              <input
                v-model="userForm.dienThoai"
                type="tel"
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Giới tính</label>
              <select v-model="userForm.phai" class="form-input">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="form-group-full">
              <label class="form-label">Địa chỉ</label>
              <textarea
                v-model="userForm.diaChi"
                rows="2"
                class="form-input"
                style="resize: none"
              ></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { readerService } from "../../services/readerService";
import SearchBar from "../../components/SearchBar.vue";

const users = ref([]);
const route = useRoute();
const showModal = ref(false);

const initialForm = {
  maDocGia: null,
  hoLot: "",
  ten: "",
  dienThoai: "",
  diaChi: "",
  phai: "Nam",
};

const userForm = ref({ ...initialForm });

const filteredUsers = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();

  if (!query) {
    return users.value;
  }
  return users.value.filter(
    (user) =>
      user.maDocGia?.toString().includes(query) ||
      (`${user.hoLot || ''} ${user.ten || ''}`).toLowerCase().includes(query)
  );
});

const fetchData = async () => {
  try {
    const res = await readerService.getAllReaders();
    users.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách Độc giả:", err);
    alert("Không thể tải dữ liệu");
  }
};

const openModal = (user) => {
  userForm.value = { ...initialForm, ...user };
  showModal.value = true;
};

const saveUser = async () => {
  try {
    await readerService.updateReader(userForm.value._id || userForm.value.id, userForm.value);
    
    showModal.value = false;
    await fetchData(); 
    alert("Cập nhật thông tin thành công!");
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Lỗi khi cập nhật dữ liệu!";
    alert(errorMsg);
    console.error(err);
  }
};

const deleteUser = async (id) => {
  if (
    confirm("Xóa độc giả sẽ xóa tài khoản. bạn có chắc?")
  ) {
    try {
      await readerService.deleteReader(id);
      fetchData(); 
      alert("Đã xóa độc giả thành công!");
    } catch (error) {
      console.error(error);
      alert("Không thể xóa độc giả này!");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto; 
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.form-group-full {
  grid-column: span 2;
}
.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 0.9em;
  color: #333;
}
.form-input {
  font-family: inherit;
}
.form-input:focus {
  outline: none;
  border-color: #007bff;
}
.disabled-input {
  background-color: #f1f1f1;
  color: #888;
  cursor: not-allowed;
}
</style>