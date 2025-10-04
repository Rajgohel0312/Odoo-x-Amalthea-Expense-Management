require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const expenseRoutes = require("./src/routes/expenses");
const approvalRoutes = require("./src/routes/approvals");
const adminRoutes = require("./src/routes/admin");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", require("./src/routes/managerRoutes"));
app.use("/api/approvals", require("./src/routes/approvalRoutes"));
app.use("/api/rules", require("./src/routes/ruleRoutes"));

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect error", err);
    process.exit(1);
  });
