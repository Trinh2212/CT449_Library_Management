require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./app/routes/auth.route");
const bookRoutes = require("./app/routes/book.route");
const borrowRoutes = require("./app/routes/borrow.route");
const publisherRoutes = require("./app/routes/publisher.route");
const staffRoutes = require("./app/routes/staff.route");
const readerRoutes = require("./app/routes/reader.route");
const connectDB = require("./app/config/db");
const createDefaultAdmin = require("./app/initializers/initial_account");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
createDefaultAdmin();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/library/books", bookRoutes);
app.use("/api/library/borrows", borrowRoutes);
app.use("/api/library/publishers", publisherRoutes);
app.use("/api/management/readers", readerRoutes);
app.use("/api/management/staff", staffRoutes);

const frontendPath = path.join(__dirname, "../library-frontend/dist");
app.use(express.static(frontendPath));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
