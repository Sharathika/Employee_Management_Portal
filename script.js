// =============================
// 🌐 Backend Connection Setup
// =============================
const API_URL = "http://localhost:5000/api";


console.log("✅ script.js loaded!");


if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorEl = document.getElementById("error");

    errorEl.textContent = ""; // clear previous errors

    if (!username || !password) {
      errorEl.textContent = "⚠️ Please enter both username and password!";
      return;
    }

    try {
      console.log("Logging in...");
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Login successful!");
        window.location.href = "dashboard.html";
      } else {
        errorEl.textContent = data.message || "❌ Invalid credentials!";
      }
    } catch (err) {
      errorEl.textContent = "🚫 Server not reachable. Please check backend.";
      console.error("Login error:", err);
    }
  });
}

// =============================
// 🧭 DASHBOARD LOGIC
// =============================
if (document.getElementById("logoutBtn")) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
  }

  // Logout Button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });

  // Fetch Employees from Backend
  async function fetchEmployees() {
    try {
      const res = await fetch(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
      }

      const employees = await res.json();
      renderEmployeeTable(employees);
      document.getElementById("totalEmployees").textContent = employees.length;

      // Count unique departments
      const departments = new Set(employees.map((emp) => emp.department));
      document.getElementById("totalDepartments").textContent = departments.size;
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  }

  // Render Employee Table
  function renderEmployeeTable(employees) {
    const tableBody = document.getElementById("employeeTable");
    tableBody.innerHTML = "";

    employees.forEach((emp) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.position}</td>
        <td>${emp.salary}</td>
        <td>${new Date(emp.hireDate).toLocaleDateString()}</td>
        <td>
          <button class="edit-btn" onclick="editEmployee('${emp.id}')">✏️</button>
          <button class="delete-btn" onclick="deleteEmployee('${emp.id}')">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // =============================
  // ➕ Add Employee Modal
  // =============================
  const addBtn = document.getElementById("addEmployeeBtn");
  const modal = document.getElementById("employeeModal");
  const closeModalBtn = document.getElementById("closeModal");
  const saveEmployeeBtn = document.getElementById("saveEmployee");

  if (addBtn) addBtn.addEventListener("click", () => (modal.style.display = "block"));
  if (closeModalBtn) closeModalBtn.addEventListener("click", () => (modal.style.display = "none"));

  // Save New Employee
  if (saveEmployeeBtn)
    saveEmployeeBtn.addEventListener("click", async () => {
      const newEmployee = {
        name: document.getElementById("empName").value.trim(),
        email: document.getElementById("empEmail").value.trim(),
        department: document.getElementById("empDept").value.trim(),
        position: document.getElementById("empPosition").value.trim(),
        salary: document.getElementById("empSalary").value.trim(),
        hireDate: document.getElementById("empHireDate").value,
      };

      if (
        !newEmployee.name ||
        !newEmployee.email ||
        !newEmployee.department ||
        !newEmployee.position ||
        !newEmployee.salary ||
        !newEmployee.hireDate
      ) {
        alert("⚠️ Please fill all fields!");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/employees`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newEmployee),
        });

        if (res.ok) {
          alert("✅ Employee added successfully!");
          modal.style.display = "none";
          fetchEmployees();
        } else {
          alert("❌ Error adding employee. Please try again.");
        }
      } catch (err) {
        console.error("Error adding employee:", err);
      }
    });

  // =============================
  // 🗑️ Delete Employee
  // =============================
  window.deleteEmployee = async function (id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("🗑️ Employee deleted successfully!");
        fetchEmployees();
      } else {
        alert("❌ Error deleting employee!");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // =============================
  // ✏️ Edit Employee (Future Feature)
  // =============================
  window.editEmployee = function (id) {
    alert("Edit feature coming soon!");
  };

  // Load employees when dashboard loads
  fetchEmployees();
}




