async function loadHTML(id, url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro ao carregar ${url}`);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadHTML("header", "/includes/header.html");
    await loadHTML("menu", "/includes/menu.html");
    await loadHTML("footer", "/includes/footer.html");

    // Verifica se está em uma página de formulário e carrega o HTML + JS correspondente
    const path = window.location.pathname;

    const formLoaders = {
        "/pages/printer/register-printer.html": {
            htmlId: "form-printer",
            htmlPath: "/includes/printer/form-printer.html",
            scriptPath: "/assets/js/printer/register-printer.js"
        },
        "/pages/manufacturer/register-manufacturer.html": {
            htmlId: "form-manufacturer",
            htmlPath: "/includes/manufacturer/form-manufacturer.html",
            scriptPath: "/assets/js/manufacturer/register-manufacturer.js"
        },
        "/pages/model/register-model.html": {
            htmlId: "form-model",
            htmlPath: "/includes/model/form-model.html",
            scriptPath: "/assets/js/model/register-model.js"
        },
        "/pages/unit/register-unit.html": {
            htmlId: "form-unit",
            htmlPath: "/includes/unit/form-unit.html",
            scriptPath: "/assets/js/unit/register-unit.js"
        },
        "/pages/building/register-building.html": {
            htmlId: "form-building",
            htmlPath: "/includes/building/form-building.html",
            scriptPath: "/assets/js/building/register-building.js"
        },
        "/pages/department/register-department.html": {
            htmlId: "form-department",
            htmlPath: "/includes/department/form-department.html",
            scriptPath: "/assets/js/department/register-department.js"
        }
    };

    if (formLoaders[path]) {
        const { htmlId, htmlPath, scriptPath } = formLoaders[path];
        const loaded = await loadHTML(htmlId, htmlPath);
        if (loaded) {
            const script = document.createElement("script");
            script.src = scriptPath;
            document.body.appendChild(script);
        }
    }
});