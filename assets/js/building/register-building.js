const apiUrl = "http://localhost:5285/api";

// Função para carregar as opções da unidade no <select>
async function loadUnits() {
  const select = document.getElementById("UnitId");
  if (!select) return;

  try {
    const res = await fetch(`${apiUrl}/unit`);
    if (!res.ok) throw new Error("Failed to fetch units");
    const data = await res.json();

    select.innerHTML = `<option value="">Select unit</option>`;

    data.forEach(unit => {
      const option = document.createElement("option");
      option.value = unit.id;
      option.textContent = unit.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    select.innerHTML = `<option value="">Error loading units</option>`;
  }
}

// Inicializa o formulário ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  loadUnits();

  const form = document.getElementById("form-register-building");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: form.building.value.trim(),
      unitId: parseInt(form.UnitId.value)
    };

    try {
      const res = await fetch(`${apiUrl}/building`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error saving building: ${errorText}`);
      }

      alert("Building saved successfully!");
      form.reset();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});
