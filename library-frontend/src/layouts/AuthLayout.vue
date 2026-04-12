<template>
  <div class="auth-layout">
    <div class="auth-wrapper">
      <div class="auth-brand">
        <div class="overlay"></div>

        <div class="brand-content">
          <h1>Thư Viện Chúng Mình</h1>
          <router-link to="/" class="back-link">←Trở về trang chủ</router-link>
        </div>
      </div>

      <div class="auth-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d0e2f3; 
  padding: 20px;
}

.auth-wrapper {
  display: flex;
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.auth-brand {
  flex: 1;
  background-image: url('/img/login.jpg');
  background-size: cover; 
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.auth-brand::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: inherit; 
  background-size: inherit;
  background-position: inherit;
  filter: blur(0.5px);
  transform: scale(1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(8, 50, 84, 0.6);
  z-index: 1;
}
.brand-content {
  position: relative;
  z-index: 2; 
}

.brand-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3); 
}

.back-link {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  border: 1px solid rgba(255,255,255,0.4);
  padding: 8px 15px;
  border-radius: 20px;
  transition: 0.3s;
  background: rgba(0,0,0,0.2); 
}

.back-link:hover {
  background: rgba(255,255,255,0.2);
  border-color: white;
}

.auth-content {
  flex: 1.2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 768px) {
  .auth-wrapper {
    flex-direction: column;
  }
  .auth-brand {
    flex: none;
    padding: 30px 20px;
  }
  .auth-brand p {
    display: none;
  }
}
</style>