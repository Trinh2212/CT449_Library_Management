<template>
  <div class="not-found">
    <img src="/img/notFound.png" alt="Not Found">
    <p>Lỗi 404, rất tiếc trang không được tìm thấy</p>
    <router-link to="/" class="btn btn-primary">Quay lại Trang chủ</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
  min-height: 100vh;
}
.not-found p {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 500;
}

</style>