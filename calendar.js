function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

let currentDate = new Date();

function updateCalendar() {
    document.getElementById('current-date').textContent = formatDate(currentDate);
}

document.getElementById('prev-day').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateCalendar();
    app.updateCurrentDate(currentDate);
});

document.getElementById('next-day').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCalendar();
    app.updateCurrentDate(currentDate);
});

window.onload = updateCalendar;
