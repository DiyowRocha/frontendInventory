function loadInclude(id, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Error to load ${file}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => {
            console.error('Error to load include:', error);
        });
}

window.addEventListener('DOMContentLoaded', () => {
    loadInclude('header', '/includes/header.html');
    loadInclude('menu', '/includes/menu.html');
    loadInclude('footer', '/includes/footer.html');
});