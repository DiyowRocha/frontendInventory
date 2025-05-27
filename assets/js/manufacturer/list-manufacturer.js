// URL base da API para manufacturers
const apiUrl = "http://localhost:5285/api/manufacturer";
const rowsPerPage = 20;

let manufacturers = [];
let currentPage = 1;

// Elementos da DOM
const tableBody = document.querySelector("#manufacturerTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

// Buscar todos os manufacturers da API
async function fetchManufacturers() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch manufacturers");
    manufacturers = await res.json();
    renderTable();
    renderPagination();
  } catch (error) {
    alert(error.message);
  }
}

// Filtrar manufacturers com base no input de busca
function filterManufacturers() {
  const term = searchInput.value.toLowerCase();
  if (!term) return manufacturers;

  return manufacturers.filter((m) =>
    (m.name || "").toLowerCase().includes(term)
  );
}

// Renderizar a tabela com base nos dados filtrados e página atual
function renderTable() {
  const filtered = filterManufacturers();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filtered.slice(start, end);

  tableBody.innerHTML = "";

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center">No records found.</td></tr>`;
    return;
  }

  for (const m of pageItems) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.name || ""}</td>
      <td>
        <button class="btn-edit" data-id="${m.id}">Edit</button>
        <button class="btn-delete" data-id="${m.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  }
}

// Renderizar botões de paginação com base nos resultados filtrados
function renderPagination() {
  const filtered = filterManufacturers();
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

// Configura os eventos da página (busca, edição, exclusão)
function setupEventListeners() {
  // Atualiza tabela ao digitar na busca
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
    renderPagination();
  });

  // Delegação de eventos para os botões Edit e Delete
  tableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains("btn-edit")) {
      window.location.href = `manufacturer-edit.html?id=${id}`;
    }

    if (target.classList.contains("btn-delete")) {
      if (confirm("Are you sure you want to delete this manufacturer?")) {
        try {
          const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete manufacturer");
          alert("Manufacturer deleted successfully");
          await fetchManufacturers(); // Atualiza a lista após exclusão
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });
}

// Inicializa a página ao carregar
document.addEventListener("DOMContentLoaded", async () => {
  await fetchManufacturers();
  setupEventListeners();
});
