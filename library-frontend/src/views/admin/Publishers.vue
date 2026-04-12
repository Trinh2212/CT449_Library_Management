<template>
  <div class="admin-page">
    <div class="page-header">
      <h3>Danh mục nhà xuất bản</h3>
      <searchBar />
      <button @click="openModal()" class="btn btn-primary">
        + Thêm NXB mới
      </button>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Tên nhà xuất bản</th>
          <th>Địa chỉ</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pub in filteredPublishers" :key="pub._id || pub.id">
          <td>{{ pub.tenNXB }}</td>
          <td>{{ pub.diaChi || "Chưa cập nhật" }}</td>
          <td>
            <button @click="openModal(pub)" class="btn-edit">
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
            <button @click="handleDelete(pub._id || pub.id)" class="btn-del">
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
        <h4>
          {{ isEdit ? "Cập nhật nhà xuất bản" : "Thêm nhà xuất bản mới" }}
        </h4>

        <form @submit.prevent="savePublisher">
          <div class="form-grid">
            <div class="form-group-full">
              <label class="form-label">Mã NXB (Số)</label>
              <input
                v-model.number="pubForm.maNXB"
                type="number"
                required
                disabled
                placeholder="VD: 1, 2, 3..."
                class="form-input"
              />
            </div>

            <div class="form-group-full">
              <label class="form-label">Tên nhà xuất bản</label>
              <input
                v-model="pubForm.tenNXB"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div class="form-group-full">
              <label class="form-label">Địa chỉ</label>
              <textarea
                v-model="pubForm.diaChi"
                rows="3"
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
import { publisherService } from "../../services/publisherService";

const route = useRoute();
const publishers = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const initialForm = {
  maNXB: null,
  tenNXB: "",
  diaChi: "",
};
const pubForm = ref({ ...initialForm });

const fetchData = async () => {
  try {
    const res = await publisherService.getAllPublishers();
    publishers.value = res.data;
  } catch (err) {
    console.error("Có Lỗi khi lấy danh sách NXB:", err);
    alert("Không thể lấy dữ liệu NXB");
  }
};

const filteredPublishers = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();
  if (!query) {
    return publishers.value;
  }
  return publishers.value.filter(
    (publisher) =>
      publisher.tenNXB?.toLowerCase().includes(query) ||
      publisher.maNXB?.toString().includes(query)
  );
});

const openModal = (pub = null) => {
  if (pub) {
    isEdit.value = true;
    pubForm.value = { ...pub };
  } else {
    isEdit.value = false;
    pubForm.value = { ...initialForm };

    if (publishers.value.length > 0) {
      pubForm.value.maNXB = Math.max(...publishers.value.map((p) => p.maNXB)) + 1;
    } else {
      pubForm.value.maNXB = 1;
    }
  }
  showModal.value = true;
};

const savePublisher = async () => {
  try {
    if (isEdit.value) {
      const pubId = pubForm.value._id || pubForm.value.id;
      await publisherService.updatePublisher(pubId, pubForm.value);
    } else {
      await publisherService.createPublisher(pubForm.value);
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
  if (
    confirm("Xóa nhà xuất bản này?(lưu ý ảnh hưởng)")
  ) {
    try {
      await publisherService.deletePublisher(id);
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("Không thể xóa NXB này!");
    }
  }
};

onMounted(() => {
  fetchData(); 
});
</script>

<style scoped>
</style>