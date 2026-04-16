<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section left-section">
        <div class="brand">
          <img src="/img/logo.png" alt="Library Logo" class="logo-img" />
          <h2>Thư Viện Chúng Mình</h2>
        </div>
        <p>Nơi lưu giữ tri thức - truyền cảm hứng học tập mỗi ngày</p>
      </div>

      <div class="footer-section right-section">
        <div class="links-wrapper">
          <h3>Liên Hệ</h3>
          <ul>
            <li>
              <a href="#">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  width="24"
                  height="24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                Email: admin123@library.com
              </a>
            </li>
            <li>
              <a href="#">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  width="24"
                  height="24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                SĐT: 0974 378 809
              </a>
            </li>
            <li>
              <a href="#">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  width="24"
                  height="24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                Địa chỉ: Phường Ninh Kiều, TP. Cần Thơ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Quản Lý Thư Viện - Học Phần Phát Triển Ứng Dụng Web</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--secondary-color);
  color: #fff;
  padding: 25px 0 15px 0;
  margin-top: 50px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0 20px;
  align-items: center;
}

.left-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-img {
  width: 45px;
  height: auto;
}

.footer-section p {
  line-height: 1.5;
  font-size: 0.9rem;
  color: #bdc3c7;
  margin: 0;
}
.right-section {
  display: flex;
  justify-content: center;
}

.footer-section h3 {
  color: #eeeff9;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 1.1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: var(--text-blur-color);
  text-decoration: none;
  transition: 0.3s;
  display: inline-block;
}

.footer-section ul li a:hover {
  color: #1abdc9;
  transform: translateX(5px);
}

.footer-bottom {
  text-align: center;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #1f4d79;
  font-size: 0.85rem;
  color: #1abdc9;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 30px;
  }

  .brand {
    justify-content: center;
  }
}
</style>
