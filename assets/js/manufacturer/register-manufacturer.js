const apiUrl = "http://localhost:5285/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-register-manufacturer");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Corrigido para buscar o valor do input correto (id="manufacturer")
    const manufacturerName = form.manufacturer?.value?.trim() || form.serialNumber?.value.trim();

    if (!manufacturerName) {
      alert("Please enter the manufacturer name.");
      return;
    }

    const data = { name: manufacturerName };

    try {
      const res = await fetch(`${apiUrl}/manufacturer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error saving manufacturer: ${errorText}`);
      }

      alert("Manufacturer saved successfully!");
      form.reset();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});