// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import User from "./models/user.js";
import "./models/employee.js";




dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Employee Management System Backend Running Successfully!");
});

// Connect to database and create default admin user
sequelize
  .sync()
  .then(async () => {
    console.log("✅ Database connected successfully!");

    // Check if admin user exists
    const existingAdmin = await User.findOne({ where: { username: "admin" } });
    if (!existingAdmin) {
      const admin  = await bcrypt.hash("admin", 10);
      await User.create({
        username: "admin",
        password: "admin",
        role: "Admin",
      });
      console.log("🆕 Default admin created → username: admin | password: admin");
    } else {
      console.log("👤 Admin user already exists.");
    }
  })
  .catch((err) => console.log("❌ Database connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



