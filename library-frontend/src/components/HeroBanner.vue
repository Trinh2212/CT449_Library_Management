<template>
  <section class="hero-banner">
    <div class="container hero-wrapper">
      <div class="hero-content">
        <h1 class="animate-fade-in">{{ title }}</h1>
        <p class="animate-fade-in-delay">{{ subtitle }}</p>
        <div class="hero-btns animate-fade-in-delay" style="margin-top: 25px">
          <router-link :to="primaryLink" class="btn btn-primary btn-lg">
            {{ primaryText }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Một Quyển Sách Là Một Cách Nhìn",
  },
  subtitle: {
    type: String,
    default:
      "Có những câu chuyện bạn chỉ nên trải nghiệm bằng các trang sách, hãy thử tìm đọc và ngẩm",
  },
  primaryText: { type: String, default: "Khám Phá Tri Thức" },
  primaryLink: { type: String, default: "/books" },
});
</script>

<style scoped>
.hero-banner {
  background-image: url("https://images.unsplash.com/photo-1673467554516-53b18fbfb681?w=1920&auto=format&fit=crop&q=80");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  padding: 100px 0;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
}

.hero-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 50px;
}

.hero-content {
  flex: 1;
  z-index: 2;
  max-width: 600px;
}
.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 25px;
  color: white;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 30px;
  opacity: 0.95;
  max-width: 550px;
  line-height: 1.6;
}
.hero-btns {
  display: flex;
  width: 100%;
  gap: 20px;
  justify-content: space-between;
}
.btn-lg {
  padding: 15px 35px;
  font-size: 1.1rem;
  border-radius: 50px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
}
.animate-fade-in {
  animation: fadeInUp 0.8s ease-out forwards;
}
.animate-fade-in-delay {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}
.animate-zoom-in {
  opacity: 0;
  animation: zoomIn 1s ease-out 0.5s forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .hero-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
  .hero-banner {
    padding: 60px 0;
    border-radius: 0 0 40px 40px;
  }
  .hero-content p {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-btns {
    justify-content: center;
    flex-direction: column;
  }
}
</style>