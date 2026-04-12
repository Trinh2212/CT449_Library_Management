<template>
  <div class="main-layout">
    <Header />
    <main class="content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
  padding: 0px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
