const apiUrl = "http://localhost:5285/api";

// Load buildings with unit name into select
async function loadBuildings() {
    const select = document.getElementById("buildingId");
    if (!select) return;

    try {
        const response = await fetch(`${apiUrl}/building`);
        if (!response.ok) throw new Error("Failed to fetch buildings");

        const buildings = await response.json();

        select.innerHTML = '<option value="">Select a building</option>';

        buildings.forEach(building => {
            const option = document.createElement("option");
            option.value = building.id;
            option.textContent = `${building.name} (${building.unitName})`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading buildings:", error);
        alert("Error loading buildings");
    }
}

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
    loadBuildings();

    const form = document.getElementById("form-register-department");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
            name: document.getElementById("department").value,
            floor: document.getElementById("floor").value,
            buildingId: document.getElementById("buildingId").value
        };

        try {
            const response = await fetch(`${apiUrl}/department`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to save department");
            }

            alert("Department registered successfully!");
            form.reset();

        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Error: ${error.message}`);
        }
    });
});