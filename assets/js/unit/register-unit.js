const apiUrl = "http://localhost:5285/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-register-unit");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      address: form.address.value.trim(),
      number: form.number.value.trim(),
      neighborhood: form.neighborhood.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value.trim(),
      zipCode: form.zipCode.value.trim()
    };

    // Validação simples (pode ser expandida conforme necessário)
    for (const key in formData) {
      if (!formData[key]) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
      const res = await fetch(`${apiUrl}/unit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error saving unit: ${errorText}`);
      }

      alert("Unit saved successfully!");
      form.reset();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});
