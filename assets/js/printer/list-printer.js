const apiUrl = "http://localhost:5285/api/printer";
const rowsPerPage = 20;

let printers = [];
let currentPage = 1;

const printersTableBody = document.querySelector("#printersTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

async function fetchPrinters() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch printers");
    printers = await res.json();
    renderTable();
    renderPagination();
  } catch (error) {
    alert(error.message);
  }
}

function filterPrinters() {
  const term = searchInput.value.toLowerCase();
  if (!term) return printers;

  return printers.filter((p) => {
    return (
      (p.serialNumber || "").toLowerCase().includes(term) ||
      (p.ipAddress || "").toLowerCase().includes(term) ||
      (p.printQueue || "").toLowerCase().includes(term) ||
      (p.manufacturerName || "").toLowerCase().includes(term) ||
      (p.modelName || "").toLowerCase().includes(term) ||
      (p.unitName || "").toLowerCase().includes(term) ||
      (p.buildingName || "").toLowerCase().includes(term) ||
      (p.departmentName || "").toLowerCase().includes(term)
    );
  });
}

function renderTable() {
  const filtered = filterPrinters();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filtered.slice(start, end);

  printersTableBody.innerHTML = "";

  if (pageItems.length === 0) {
    printersTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center">No records found.</td></tr>`;
    return;
  }

  for (const p of pageItems) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.serialNumber || ""}</td>
      <td>${p.ipAddress || ""}</td>
      <td>${p.printQueue || ""}</td>
      <td>${p.manufacturerName || ""}</td>
      <td>${p.modelName || ""}</td>
      <td>${p.unitName || ""}</td>
      <td>${p.buildingName || ""}</td>
      <td>${p.departmentName || ""}</td>
      <td>
        <button class="btn-edit" data-id="${p.id}">Edit</button>
        <button class="btn-delete" data-id="${p.id}">Delete</button>
      </td>
    `;

    printersTableBody.appendChild(tr);
  }
}

function renderPagination() {
  const filtered = filterPrinters();
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

  printersTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btn-edit")) {
      const id = target.dataset.id;
      window.location.href = `printer-edit.html?id=${id}`;
    }

    if (target.classList.contains("btn-delete")) {
      const id = target.dataset.id;
      if (confirm("Are you sure you want to delete this printer?")) {
        try {
          const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete printer");
          alert("Printer deleted successfully");
          await fetchPrinters();
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchPrinters();
  setupEventListeners();
});