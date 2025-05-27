const apiUrl = "http://localhost:5285/api";

async function loadOptions(endpoint, selectId, placeholderText, textProperty = "name") {
  const select = document.getElementById(selectId);
  if (!select) return;

  try {
    const res = await fetch(`${apiUrl}/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await res.json();

    select.innerHTML = `<option value="">${placeholderText}</option>`;

    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item[textProperty] || "Unknown";
      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    select.innerHTML = `<option value="">Error loading ${endpoint}</option>`;
  }
}

async function initializeForm() {
  await loadOptions("manufacturer", "manufacturerId", "Select manufacturer");
}

document.addEventListener("DOMContentLoaded", () => {
  initializeForm();

  const form = document.getElementById("form-register-model");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: form.model.value.trim(),
      manufacturerId: parseInt(form.manufacturerId.value)
    };

    if (!formData.name) {
      alert("Please enter the model name.");
      return;
    }

    if (!formData.manufacturerId) {
      alert("Please select a manufacturer.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error saving model: ${errorText}`);
      }

      alert("Model saved successfully!");
      form.reset();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});