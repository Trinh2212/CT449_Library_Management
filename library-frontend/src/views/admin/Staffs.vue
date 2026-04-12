<template>
  <div class="admin-page">
    <div class="page-header">
      <h3>Danh sách Nhân viên</h3>
      <searchBar />
      <button @click="openModal()" class="btn btn-primary">
        + Thêm nhân viên mới
      </button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Họ Tên</th>
          <th>Chức vụ</th>
          <th>Số điện thoại</th>
          <th>Địa chỉ</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="staff in filteredStaffs" :key="staff._id">
          <td>{{ staff.hoTenNV }}</td>
          <td>
            <span class="badge">{{ staff.chucVu || "Nhân viên" }}</span>
          </td>
          <td>{{ staff.soDienThoai || "Chưa cập nhật" }}</td>
          <td>{{ staff.diaChi || "Chưa cập nhật" }}</td>
          <td>
            <button @click="openModal(staff)" class="btn-edit">
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
            <button @click="deleteStaff(staff.id || staff._id)" class="btn-del">
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
        <h4>{{ isEdit ? "Cập nhật nhân viên" : "Thêm nhân viên mới" }}</h4>

        <form @submit.prevent="saveStaff">
          <div class="form-grid">
            <div class="form-group-full">
              <label class="form-label">Mã số nhân viên</label>
              <input
                v-model="staffForm.msnv"
                type="text"
                required
                disabled
                placeholder="1, 2, 3, ..."
                class="form-input"
              />
            </div>
            <template v-if="!isEdit">
              <div class="form-group-full">
                <label class="form-label">Email</label>
                <input
                  v-model="staffForm.email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="nhanvien@gmail.com"
                />
              </div>
              <div v-if="!isEdit" class="form-group-full">
                <label class="form-label">Mật khẩu</label>
                <div class="input-wrapper">
                  <input
                    v-model="staffForm.password"
                    :type="showStaffPassword ? 'text' : 'password'"
                    required
                    class="form-input"
                    placeholder="Mật khẩu của nhân viên"
                  />
                  <button
                    type="button"
                    @click="showStaffPassword = !showStaffPassword"
                    class="password-toggle"
                  >
                    <span v-if="!showStaffPassword">
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
            </template>
            <div class="form-group-full">
              <label class="form-label">Họ và tên</label>
              <input
                v-model="staffForm.hoTenNV"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div>
              <label class="form-label">Chức vụ</label>
              <select v-model="staffForm.chucVu" class="form-input">
                <option value="Thủ thư">Thủ thư</option>
                <option value="Nhân viên kho">Nhân viên thư viện</option>
                <option value="Nhân viên kho">kỹ thuật viên</option>
              </select>
            </div>

            <div>
              <label class="form-label">Số điện thoại</label>
              <input
                v-model="staffForm.soDienThoai"
                type="tel"
                class="form-input"
              />
            </div>

            <div class="form-group-full">
              <label class="form-label">Địa chỉ</label>
              <textarea
                v-model="staffForm.diaChi"
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
            <button type="submit" class="btn btn-primary">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import searchBar from "../../components/SearchBar.vue";
import { useRoute } from "vue-router";
import { staffService } from "../../services/staffService";

const route = useRoute();
const staffs = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const showStaffPassword = ref(false);

const initialForm = {
  msnv: null,
  hoTenNV: "",
  chucVu: "Thủ thư",
  soDienThoai: "",
  diaChi: "",
  email: "",
  password: "",
};

const staffForm = ref({ ...initialForm });

const filteredStaffs = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();

  if (!query) {
    return staffs.value;
  }
  return staffs.value.filter(
    (staff) =>
      staff.hoTenNV?.toLowerCase().includes(query) ||
      staff.msnv?.toString().includes(query),
  );
});

const fetchData = async () => {
  try {
    const res = await staffService.getAllStaff();
    staffs.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách nhân viên:", err);
    alert("Không thể tải dữ liệu");
  }
};

const openModal = (staff = null) => {
  showStaffPassword.value = false;
  if (staff) {
    isEdit.value = true;
    staffForm.value = {
      ...initialForm,
      ...staff,
      password: "",
    };
  } else {
    isEdit.value = false;
    staffForm.value = { ...initialForm };
    if (staffs.value.length > 0) {
      staffForm.value.msnv = Math.max(...staffs.value.map((s) => s.msnv)) + 1;
    } else {
      staffForm.value.msnv = 1;
    }
  }
  showModal.value = true;
};

const saveStaff = async () => {
  try {
    if (isEdit.value) {
      await staffService.updateStaff(
        staffForm.value._id || staffForm.value.id,
        staffForm.value,
      );
    } else {
      await staffService.createStaff(staffForm.value);
    }

    showModal.value = false;
    await fetchData();
    alert("Thao tác thành công!");
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Lỗi khi lưu dữ liệu!";
    alert(errorMsg);
    console.error(err);
  }
};
const deleteStaff = async (id) => {
  if (confirm("Xóa nhân viên này khỏi hệ thống?")) {
    try {
      await staffService.deleteStaff(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa nhân viên này!");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}
.form-group-full {
  grid-column: span 2;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
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
  display: flex;
  align-items: center;
  padding: 0;
  color: #666;
}

.password-toggle:hover {
  color: #000;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
</style>
