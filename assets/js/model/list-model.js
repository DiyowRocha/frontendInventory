// URL da API para modelos
const apiUrl = "http://localhost:5285/api/model";
const rowsPerPage = 20;

let models = [];
let currentPage = 1;

// Elementos DOM
const tableBody = document.querySelector("#modelTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

// Buscar modelos na API
async function fetchModels() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch models");
    models = await res.json();
    renderTable();
    renderPagination();
  } catch (error) {
    alert(error.message);
  }
}

// Filtro baseado na busca por nome do modelo ou fabricante
function filterModels() {
  const term = searchInput.value.toLowerCase();
  if (!term) return models;

  return models.filter((m) =>
    (m.name || "").toLowerCase().includes(term) ||
    (m.manufacturerName || "").toLowerCase().includes(term)
  );
}

// Renderiza os dados na tabela
function renderTable() {
  const filtered = filterModels();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filtered.slice(start, end);

  tableBody.innerHTML = "";

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center">No records found.</td></tr>`;
    return;
  }

  for (const m of pageItems) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.name || ""}</td>
      <td>${m.manufacturerName || ""}</td>
      <td>
        <button class="btn-edit" data-id="${m.id}">Edit</button>
        <button class="btn-delete" data-id="${m.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  }
}

// Renderização da paginação
function renderPagination() {
  const filtered = filterModels();
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

// Eventos de busca, editar e deletar
function setupEventListeners() {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
    renderPagination();
  });

  tableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains("btn-edit")) {
      window.location.href = `model-edit.html?id=${id}`;
    }

    if (target.classList.contains("btn-delete")) {
      if (confirm("Are you sure you want to delete this model?")) {
        try {
          const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete model");
          alert("Model deleted successfully");
          await fetchModels();
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
  await fetchModels();
  setupEventListeners();
});
