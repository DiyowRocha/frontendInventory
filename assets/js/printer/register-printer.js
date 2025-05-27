const apiUrl = "http://localhost:5285/api";

document.addEventListener("DOMContentLoaded", () => {
    populateSelect("manufacturerId", `${apiUrl}/Manufacturer`);
    populateSelect("modelId", `${apiUrl}/Model`);
    populateSelect("unitId", `${apiUrl}/Unit`);
    populateSelect("buildingId", `${apiUrl}/Building`);
    populateSelect("departmentId", `${apiUrl}/Department`);

    const form = document.getElementById("form-register-printer");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = {
                serialNumber: document.getElementById("serialNumber").value,
                ipAddress: document.getElementById("ipAddress").value,
                printQueue: document.getElementById("printQueue").value,
                manufacturerId: parseInt(document.getElementById("manufacturerId").value),
                modelId: parseInt(document.getElementById("modelId").value),
                unitId: parseInt(document.getElementById("unitId").value),
                buildingId: parseInt(document.getElementById("buildingId").value),
                departmentId: parseInt(document.getElementById("departmentId").value)
            };

            try {
                const res = await fetch(`${apiUrl}/Printer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    alert("Printer registered successfully!");
                    form.reset();
                } else {
                    const errorData = await res.json();
                    alert("Error registering printer: " + (errorData.message || res.status));
                }
            } catch (err) {
                console.error(err);
                alert("Error connecting to API.");
            }
        });
    }
});

async function populateSelect(selectId, endpoint) {
    const select = document.getElementById(selectId);
    if (!select) return;

    try {
        const res = await fetch(endpoint);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Data is not an array");

        select.innerHTML = '<option value="">-- Select --</option>';

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name || item.modelName || item.departmentName || item.unitName || item.buildingName || "Unnamed";
            select.appendChild(option);
        });

    } catch (err) {
        console.error(`Failed to populate ${selectId} from ${endpoint}:`, err);
        select.innerHTML = '<option value="">-- Error loading --</option>';
    }
}