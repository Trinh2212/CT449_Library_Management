<template>
  <div class="borrows-page">
    <div class="page-header">
      <h1>Quản lý Phiếu mượn & Duyệt yêu cầu</h1>
      <SearchBar />
    </div>

    <div class="content-controls">
      <div class="filter-group">
        <button
          @click="filterStatus = 'Tất cả'"
          :class="getFilterClass('Tất cả')"
        >
          Tất cả
        </button>
        <button
          @click="filterStatus = 'Chờ duyệt'"
          :class="getFilterClass('Chờ duyệt')"
        >
          Chờ duyệt
        </button>
        <button
          @click="filterStatus = 'Đang mượn'"
          :class="getFilterClass('Đang mượn')"
        >
          Đang mượn
        </button>
        <button
          @click="filterStatus = 'Quá hạn'"
          :class="getFilterClass('Quá hạn')"
        >
          Quá hạn
        </button>
        <button
          @click="filterStatus = 'Đã trả'"
          :class="getFilterClass('Đã trả')"
        >
          Đã trả
        </button>
        <button
          @click="filterStatus = 'Từ chối'"
          :class="getFilterClass('Từ chối')"
        >
          Từ chối
        </button>
      </div>
    </div>
    <div class="table-card">
      <div v-if="filteredBorrows.length > 0" class="table-scroll">
        <table class="data-table">
          <thead class="table-header">
            <tr>
              <th>Người Mượn</th>
              <th>Tên Sách</th>
              <th>Trạng thái</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="item in filteredBorrows"
              :key="item._id"
              class="table-row"
            >
              <td class="table-cell table-cell-bold">
                {{ getBorrowerName(item.borrowerId) }}
              </td>
              <td class="table-cell">
                {{ item.bookId?.tenSach || "Sách không tồn tại" }}
              </td>
              <td class="table-cell">
                <span :class="getStatusClass(item)" class="status-badge">
                  {{ getDisplayStatus(item) }}
                </span>
              </td>
              <td class="table-cell">
                <span
                  v-if="item.status === 'Chờ duyệt' || !item.ngayMuon"
                  class="text-muted"
                >
                  Chưa cập nhật
                </span>
                <span v-else>
                  {{ formatDate(item.ngayMuon) }}
                </span>
              </td>
              <td class="table-cell">
                <span
                  v-if="item.hanTra"
                  :class="{
                    'text-danger': checkOverdueState(item) === 'overdue',
                  }"
                >
                  {{ formatDate(item.hanTra) }}
                </span>
              </td>
              <td class="table-cell">
                <span v-if="item.status === 'Đã trả'">
                  {{ item.ngayTra ? formatDate(item.ngayTra) : "Lỗi data" }}
                </span>
              </td>

              <td class="table-cell table-actions">
                <div v-if="item.status === 'Chờ duyệt'" class="btn-group">
                  <button
                    @click="handleApprove(item._id)"
                    class="btn-action btn-approve"
                    title="Duyệt yêu cầu"
                  >
                    Duyệt
                  </button>
                  <button
                    @click="handleReject(item._id)"
                    class="btn-action btn-reject"
                    title="Từ chối yêu cầu"
                  >
                    Từ chối
                  </button>
                </div>

                <button
                  v-else-if="item.status === 'Đang mượn'"
                  @click="handleReturn(item)"
                  class="btn-action btn-return"
                  title="Xác nhận khách đã trả sách"
                >
                  Xác nhận trả
                </button>

                <span v-else-if="item.status === 'Đã trả'" class="text-done">
                  Đã trả sách
                </span>

                <span v-else-if="item.status === 'Từ chối'" class="text-done">
                  Bị từ chối
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-data">Không tìm thấy phiếu mượn nào phù hợp.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { borrowService } from "../../services/borrowService";
import { useRoute } from "vue-router";
import SearchBar from "../../components/SearchBar.vue";

const route = useRoute();
const borrows = ref([]);
const filterStatus = ref("Tất cả");

const fetchData = async () => {
  try {
    const res = await borrowService.getAllBorrows();
    borrows.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách:", err);
  }
};
onMounted(fetchData);

function checkOverdueState(item) {
  if (!item.hanTra) return "normal";
  const hanTraDate = new Date(item.hanTra);
  hanTraDate.setHours(0, 0, 0, 0);

  if (item.status === "Đang mượn") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > hanTraDate ? "overdue" : "normal";
  }

  if (item.status === "Đã trả" && item.ngayTra) {
    const ngayTraDate = new Date(item.ngayTra);
    ngayTraDate.setHours(0, 0, 0, 0);
    return ngayTraDate > hanTraDate ? "returned_late" : "normal";
  }
  return "normal";
}

const filteredBorrows = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();
  let filtered = borrows.value;

  if (filterStatus.value !== "Tất cả") {
    if (filterStatus.value === "Quá hạn") {
      filtered = filtered.filter((b) => {
        const state = checkOverdueState(b);
        return state === "overdue" || state === "returned_late";
      });
    } else if (filterStatus.value === "Đã trả") {
      filtered = filtered.filter(
        (b) =>
          b.status === "Đã trả" && checkOverdueState(b) !== "returned_late",
      );
    } else {
      filtered = filtered.filter((b) => b.status === filterStatus.value);
    }
  }

  if (query) {
    filtered = filtered.filter((item) => {
      const bookName = (item.bookId?.tenSach || "").toLowerCase();
      const borrowerName = getBorrowerName(item.borrowerId).toLowerCase();
      return bookName.includes(query) || borrowerName.includes(query);
    });
  }
  return filtered;
});

function getBorrowerName(borrowerId) {
  if (!borrowerId) return "ẩn";
  return borrowerId.ten || borrowerId.hoTenNV || "ẩn";
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function getFilterClass(status) {
  return ["filter-btn", filterStatus.value === status ? "active" : ""];
}

const getDisplayStatus = (item) => {
  const state = checkOverdueState(item);
  if (state === "overdue" || state === "returned_late") return "Quá hạn";
  return item.status;
};

const getStatusClass = (item) => {
  const state = checkOverdueState(item);
  if (state === "overdue" || state === "returned_late") return "status-overdue";

  switch (item.status) {
    case "Chờ duyệt":
      return "status-pending";
    case "Đang mượn":
      return "status-borrowing";
    case "Đã trả":
      return "status-done";
    case "Từ chối":
      return "status-rejected";
    default:
      return "";
  }
};

const handleApprove = async (id) => {
  if (!id) return alert("ID không hợp lệ!");
  if (confirm("Xác nhận duyệt cho mượn?")) {
    try {
      await borrowService.approveBorrow(id);
      alert("Đã duyệt thành công!");
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi duyệt:", error);
      alert("Lỗi hệ thống khi duyệt!");
    }
  }
};

const handleReject = async (id) => {
  if (!id) return alert("ID không hợp lệ!");
  if (confirm("Xác nhận từ chối cho mượn?")) {
    try {
      await borrowService.rejectBorrow(id);
      alert("Đã từ chối và cập nhật lại số lượng");
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      alert("Lỗi hệ thống khi từ chối!");
    }
  }
};

const handleReturn = async (item) => {
  if (!item || !item._id) return alert("Dữ liệu sách không hợp lệ!");
  let confirmMsg = "Xác nhận độc giả đã trả sách?";
  if (checkOverdueState(item) === "overdue") {
    confirmMsg = "Phiếu mượn quá hạn, thu phí và xác nhận trả sách?";
  }
  if (!confirm(confirmMsg)) return;
  try {
    await borrowService.markAsReturned(item._id);
    alert("Đã xác nhận trả sách!");
    await fetchData();
  } catch (err) {
    console.error("Lỗi xử lý trả sách:", err);
    alert("Lỗi hệ thống khi xử lý trả sách");
  }
};
</script>
<style scoped>
.borrows-page {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}
.content-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 20px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: #f1f5f9;
}

.filter-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header th {
  background-color: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #334155;
  vertical-align: middle;
}

.table-cell-bold {
  font-weight: 600;
  color: #0f172a;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
}

.status-returned-late {
  background: #f1f5f9;
  color: #475569;
}

.text-danger {
  color: #dc2626;
  font-weight: bold;
}
.text-muted {
  color: #94a3b8;
  font-style: italic;
  font-size: 13px;
}
.text-done {
  color: #94a3b8;
  font-style: italic;
  font-size: 13px;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-group {
  display: flex;
  gap: 6px;
}

.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  color: white;
}
.btn-action:hover {
  opacity: 0.85;
}
.btn-approve {
  background-color: #10b981;
}
.btn-reject {
  background-color: #ef4444;
}
.btn-return {
  background-color: #3b82f6;
}
.no-data {
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-size: 15px;
}

@media (max-width: 768px) {
  .borrows-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .filter-group {
    display: flex;
    overflow-x: auto;
    padding-bottom: 8px;
    width: 100%;
    scrollbar-width: none;
  }

  .filter-group::-webkit-scrollbar {
    display: none; 
  }

  .filter-btn {
    white-space: nowrap; 
    padding: 6px 14px;
    font-size: 13px;
  }

  .content-controls {
    margin-bottom: 16px;
  }
}
</style>
