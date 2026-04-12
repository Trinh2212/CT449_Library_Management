<template>
  <div class="my-borrows">
    <div class="page-header">
      <h2>Lịch sử đăng ký & mượn sách</h2>
      <SearchBar/>
    </div>
    <div v-if="myBorrows.length > 0" class="borrow-list">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Tên Sách</th>
            <th>Ngày Mượn</th>
            <th>Hạn Trả</th>
            <th>Ngày Trả</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="item in filteredBorrows" :key="item._id">
            <td>{{ item.bookId ? item.bookId.tenSach : 'đang tải....' }}</td>

            <td>
              <span v-if="item.status === 'Chờ duyệt'" class="text-muted italic">chưa cập nhật</span>
              <span v-else-if="item.status === 'Từ chối'">-</span>
              <span v-else>{{ formatDate(item.ngayMuon) }}</span>
            </td>

            <td>
              <span v-if="item.status === 'Đang mượn' || item.status === 'Đã trả'">
                {{ formatDate(item.hanTra) }}
              </span>
              <span v-else>-</span>
            </td>

            <td>{{ item.ngayTra ? formatDate(item.ngayTra) : "-" }}</td>

            <td>
              <span :class="getStatusClass(item.status)" class="status-badge">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-data">Bạn chưa có yêu cầu mượn sách nào</div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { borrowService } from "../services/borrowService";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";
import SearchBar from "../components/SearchBar.vue";

const auth = useAuthStore();
const route = useRoute();
const myBorrows = ref([]);

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN");
};

const getStatusClass = (status) => {
  switch (status) {
    case "Chờ duyệt": return "status-pending";
    case "Đang mượn": return "status-borrowing";
    case "Đã trả": return "status-returned";
    case "Từ chối": return "status-rejected";
    default: return "";
  }
};

const filteredBorrows = computed(() => {
  const query = (route.query.q || "").toString().toLowerCase().trim();
  
  if (!query) {
    return myBorrows.value;
  }

  return myBorrows.value.filter(
    (item) => item.bookId?.tenSach?.toLowerCase().includes(query)
  );
});

async function fetchMyBorrows() {
  try {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;
    
    const userObj = JSON.parse(userRaw);
    
    const myId = userObj.msnv || userObj.maDocGia;
    const myModel = userObj.role === "admin" ? "Staff" : "User";

    if (!myId) {
      console.error("Không tìm thấy ID người dùng");
      return;
    }

    const res = await borrowService.getBorrowHistoryByUser(myId);
    
    if (res.data && Array.isArray(res.data)) {
      myBorrows.value = res.data.filter(item => item.onModel === myModel);
    }
    
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử mượn:", err);
  }
}

onMounted(fetchMyBorrows);
</script>
<style scoped>


.status-pending { color: #fc6500; font-weight: bold; }   
.status-borrowing { color: #00f75a; font-weight: bold; } 
.status-returned { color: #0112fe; font-weight: bold; }  
.status-rejected { color: #e74c3c; font-weight: bold; } 

.my-borrows {
  padding: 20px;
  background: white;
  border-radius: 8px;
}
.text-success {
  color: #2ecc71;
  font-weight: bold;
}
.text-danger {
  color: #e74c3c;
  font-weight: bold;
}
.empty-state {
  text-align: center;
  padding: 50px;
}
</style>
