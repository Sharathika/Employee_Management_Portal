// routes/employeeRoutes.js
import express from "express";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

// CRUD routes for employees
router.get("/", getEmployees);
router.post("/", addEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
