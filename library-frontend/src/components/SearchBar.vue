<template>
  <div class="search-bar" :class="{ 'is-header': variant === 'header' }">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Bạn muốn tìm gì?"
      @input="handleInput"
      @keyup.enter="handleSearch"
    />
    <span class="search-icon" @click="handleSearch">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#555"
        width="20"
        height="20"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  variant: {
    type: String,
    default: "search-bar",
  },
});

const router = useRouter();
const route = useRoute();
const searchQuery = ref("");

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q;
  }
});

watch(
  () => route.query.q,
  (newQ) => {
    searchQuery.value = newQ || "";
  },
);

const handleSearch = () => {
  const query = searchQuery.value.trim();

  if (props.variant === "header") {
    router.push({ path: "/books", query: query ? { q: query } : {} });
  } else {
    router.replace({ query: query ? { q: query } : {} });
  }
};

const handleInput = () => {
  const query = searchQuery.value.trim();

  // Chỉ cho phép gõ tới đâu đổi URL tới đó nếu không phải là thanh banner trang chủ
  if (props.variant !== "header") {
    router.replace({ query: query ? { q: query } : {} });
  }
};
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-bar.is-header {
  max-width: 300px;
}

.search-bar input {
  width: 100%;
  padding: 10px 40px 10px 18px;
  border: 1px solid #ddd;
  border-radius: 50px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

.search-bar input:focus {
  border-color: #23384d;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(35, 56, 77, 0.1);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon:hover {
  cursor: pointer;
  transform: translateY(-50%) scale(1.1);
}
</style>
