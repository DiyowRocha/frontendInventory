const apiUrl = "http://localhost:5285/api/unit";
const rowsPerPage = 20;

let units = [];
let currentPage = 1;

const tableBody = document.querySelector("#unitTable tbody");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

// Busca todos os registros da API
async function fetchUnits() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Erro ao buscar unidades");
    units = await res.json();
    renderTable();
    renderPagination();
  } catch (error) {
    alert(error.message);
  }
}

// Filtra unidades conforme a busca
function filterUnits() {
  const term = searchInput.value.toLowerCase();
  if (!term) return units;

  return units.filter((u) =>
    (u.name || "").toLowerCase().includes(term) ||
    (u.address || "").toLowerCase().includes(term) ||
    (u.number || "").toLowerCase().includes(term) ||
    (u.neighborhood || "").toLowerCase().includes(term) ||
    (u.city || "").toLowerCase().includes(term) ||
    (u.state || "").toLowerCase().includes(term) ||
    (u.zipCode || "").toLowerCase().includes(term)
  );
}

// Renderiza a tabela de dados
function renderTable() {
  const filtered = filterUnits();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = filtered.slice(start, end);

  tableBody.innerHTML = "";

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  for (const u of pageItems) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name || ""}</td>
      <td>${u.address || ""}</td>
      <td>${u.number || ""}</td>
      <td>${u.neighborhood || ""}</td>
      <td>${u.city || ""}</td>
      <td>${u.state || ""}</td>
      <td>${u.zipCode || ""}</td>
      <td>
        <button class="btn-edit" data-id="${u.id}">Edit</button>
        <button class="btn-delete" data-id="${u.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  }
}

// Renderiza os botões de paginação
function renderPagination() {
  const filtered = filterUnits();
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

// Define os eventos de busca e ações nos botões
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
      window.location.href = `unit-edit.html?id=${id}`;
    }

    if (target.classList.contains("btn-delete")) {
      if (confirm("Deseja realmente excluir esta unidade?")) {
        try {
          const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Erro ao excluir unidade");
          alert("Unidade excluída com sucesso");
          await fetchUnits();
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
  await fetchUnits();
  setupEventListeners();
});
