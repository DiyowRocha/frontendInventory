const apiUrl = "http://localhost:5285/api/building";
const rowsPerPage = 20;

let buildings = [];
let currentPage = 1;

const buildingsTableBody = document.querySelector("#buildingsTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

// Buscar dados da API
async function fetchBuildings() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch buildings");
    buildings = await res.json();
    renderTable();
    renderPagination();
  } catch (error) {
    alert(error.message);
  }
}

// Filtrar os dados com base na busca
function filterBuildings() {
  const term = searchInput.value.toLowerCase();
  if (!term) return buildings;

  return buildings.filter((b) => {
    return (
      (b.name || "").toLowerCase().includes(term) ||
      (b.unitName || "").toLowerCase().includes(term)
    );
  });
}

// Renderizar tabela com paginação
function renderTable() {
  const filtered = filterBuildings();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filtered.slice(start, end);

  buildingsTableBody.innerHTML = "";

  if (pageItems.length === 0) {
    buildingsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center">No records found.</td></tr>`;
    return;
  }

  for (const b of pageItems) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${b.name || ""}</td>
      <td>${b.unitName || "N/A"}</td>
      <td>
        <button class="btn-edit" data-id="${b.id}">Edit</button>
        <button class="btn-delete" data-id="${b.id}">Delete</button>
      </td>
    `;

    buildingsTableBody.appendChild(tr);
  }
}

// Renderizar botões de paginação
function renderPagination() {
  const filtered = filterBuildings();
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

// Eventos para busca, editar e deletar
function setupEventListeners() {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
    renderPagination();
  });

  buildingsTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btn-edit")) {
      const id = target.dataset.id;
      window.location.href = `building-edit.html?id=${id}`;
    }

    if (target.classList.contains("btn-delete")) {
      const id = target.dataset.id;
      if (confirm("Are you sure you want to delete this building?")) {
        try {
          const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete building");
          alert("Building deleted successfully");
          await fetchBuildings();
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });
}

// Inicialização do script
document.addEventListener("DOMContentLoaded", async () => {
  await fetchBuildings();
  setupEventListeners();
});