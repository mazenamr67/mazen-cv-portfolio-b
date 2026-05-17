// Toggle sections (Education, Experience, Skills)
function toggleSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.style.display = (section.style.display === 'none') ? 'block' : 'none';
    }
}

// Toggle Dark/Light Theme
function changeTheme() {
    document.body.classList.toggle('light-mode');
}

// Show live date and time
function updateDateTime() {
    const dtElement = document.getElementById('datetime');
    if (dtElement) {
        dtElement.textContent = new Date().toLocaleString('en-GB');
    }
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();