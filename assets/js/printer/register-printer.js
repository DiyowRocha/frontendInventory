const apiUrl = "http://localhost:5285/api";

// Função para carregar opções de selects com filtro opcional
async function loadOptions(endpoint, selectId, placeholderText, textProperty = "name", filterFn = null) {
  const select = document.getElementById(selectId);
  if (!select) return;

  try {
    const res = await fetch(`${apiUrl}/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await res.json();

    // Limpa opções e adiciona placeholder
    select.innerHTML = `<option value="">${placeholderText}</option>`;

    // Aplica filtro se houver
    const filteredData = filterFn ? data.filter(filterFn) : data;

    filteredData.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item[textProperty] || "Unknown";
      select.appendChild(option);
    });

    // Se nenhum item após filtro, pode mostrar opção disabled "No items found"
    if (filteredData.length === 0) {
      select.innerHTML = `<option value="" disabled>No items found</option>`;
    }
  } catch (error) {
    console.error(error);
    select.innerHTML = `<option value="">Error loading ${endpoint}</option>`;
  }
}

// Inicializa o formulário carregando todos os selects
async function initializeForm() {
  await loadOptions("manufacturer", "manufacturerId", "Select manufacturer");

  // Carrega modelos SEM filtro para iniciar
  await loadOptions("model", "modelId", "Select model");

  // Carrega unidades
  await loadOptions("unit", "unitId", "Select unit");

  // Carrega todos os prédios, serão filtrados depois
  await loadOptions("building", "buildingId", "Select building");

  // Carrega todos os departamentos, serão filtrados depois
  await loadOptions("department", "departmentId", "Select department");
}

// Filtra modelos por fabricante selecionado
document.getElementById("manufacturerId").addEventListener("change", async (e) => {
  const selectedManufacturerId = parseInt(e.target.value);
  if (selectedManufacturerId) {
    await loadOptions(
      "model",
      "modelId",
      "Select model",
      "name",
      model => model.manufacturerName && model.manufacturerName.toLowerCase() === e.target.options[e.target.selectedIndex].text.toLowerCase()
    );
  } else {
    document.getElementById("modelId").innerHTML = `<option value="">Select model</option>`;
  }
});

// Filtra buildings por unit selecionada (usa unitName)
document.getElementById("unitId").addEventListener("change", async (e) => {
  const selectedUnitName = e.target.options[e.target.selectedIndex]?.text;
  if (selectedUnitName) {
    await loadOptions(
      "building",
      "buildingId",
      "Select building",
      "name",
      building => building.unitName && building.unitName.toLowerCase() === selectedUnitName.toLowerCase()
    );
  } else {
    document.getElementById("buildingId").innerHTML = `<option value="">Select building</option>`;
    document.getElementById("departmentId").innerHTML = `<option value="">Select department</option>`;
  }
});

// Filtra departments por building selecionado (usa buildingName)
document.getElementById("buildingId").addEventListener("change", async (e) => {
  const selectedBuildingName = e.target.options[e.target.selectedIndex]?.text;
  if (selectedBuildingName) {
    await loadOptions(
      "department",
      "departmentId",
      "Select department",
      "name",
      department => department.buildingName && department.buildingName.toLowerCase() === selectedBuildingName.toLowerCase()
    );
  } else {
    document.getElementById("departmentId").innerHTML = `<option value="">Select department</option>`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeForm();

  const form = document.getElementById("form-register-printer");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      serialNumber: form.serialNumber.value.trim(),
      ipAddress: form.ipAddress.value.trim(),
      printQueue: form.printQueue.value.trim(),
      manufacturerId: parseInt(form.manufacturerId.value),
      modelId: parseInt(form.modelId.value),
      unitId: parseInt(form.unitId.value),
      buildingId: parseInt(form.buildingId.value),
      departmentId: parseInt(form.departmentId.value)
    };

    try {
      const res = await fetch(`${apiUrl}/printer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error saving printer: ${errorText}`);
      }

      alert("Printer saved successfully!");
      form.reset();

      // Reset selects to reload full data
      initializeForm();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});