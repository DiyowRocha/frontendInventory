const apiUrl = "http://localhost:5285/api/department";
const rowsPerPage = 20;

let departments = [];
let currentPage = 1;

const departmentsTableBody = document.querySelector("#departmentsTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

async function fetchDepartments() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch departments");
    departments = await res.json();
    renderTable();
    renderPagination();
  } catch (error) {
    alert(error.message);
  }
}

function filterDepartments() {
  const term = searchInput.value.toLowerCase();
  if (!term) return departments;

  return departments.filter((d) => {
    return (
      (d.name || "").toLowerCase().includes(term) ||
      (d.floor || "").toLowerCase().includes(term) ||
      (d.buildingName || "").toLowerCase().includes(term)
    );
  });
}

function renderTable() {
  const filtered = filterDepartments();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filtered.slice(start, end);

  departmentsTableBody.innerHTML = "";

  if (pageItems.length === 0) {
    departmentsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center">No records found.</td></tr>`;
    return;
  }

  for (const d of pageItems) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${d.name || ""}</td>
      <td>${d.floor || ""}</td>
      <td>${d.buildingName || ""}</td>
      <td>
        <button class="btn-edit" data-id="${d.id}">Edit</button>
        <button class="btn-delete" data-id="${d.id}">Delete</button>
      </td>
    `;

    departmentsTableBody.appendChild(tr);
  }
}

function renderPagination() {
  const filtered = filterDepartments();
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  paginationDiv.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "pagination-btn active" : "pagination-btn";
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });
    paginationDiv.appendChild(btn);
  }
}

function setupEventListeners() {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
    renderPagination();
  });

  departmentsTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btn-edit")) {
      const id = target.dataset.id;
      window.location.href = `department-edit.html?id=${id}`;
    }

    if (target.classList.contains("btn-delete")) {
      const id = target.dataset.id;
      if (confirm("Are you sure you want to delete this department?")) {
        try {
          const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete department");
          alert("Department deleted successfully");
          await fetchDepartments();
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchDepartments();
  setupEventListeners();
});
