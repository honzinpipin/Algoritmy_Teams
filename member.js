// Funkce pro získání informací o členu z URL nebo sessionStorage
function getMemberDetails() {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId'); // Získání ID člena z URL (např. ?memberId=12345)

    // Načteme seznam členů z sessionStorage
    const members = JSON.parse(sessionStorage.getItem('teamMembers')) || [];

    // Najdeme člena podle ID
    const member = members.find(m => m.id === parseFloat(memberId));

    if (member) {
        // Zobrazíme jméno člena
        document.getElementById('member-name').textContent = member.name;
        document.getElementById('member-role').textContent = member.role; // Dynamické zobrazení role
        // Pokud je email součástí člena, můžete ho přidat zde
        document.getElementById('member-email').textContent = member.email || 'No email provided'; // Předpokládáme, že člen má email

        // Načteme a zobrazíme úkoly přiřazené členovi
        displayAssignedTasks(memberId);
    } else {
        // Pokud člen neexistuje, zobrazí se zpráva
        document.getElementById('member-name').textContent = 'Member not found';
        document.getElementById('member-role').textContent = 'N/A';
    }
}

// Funkce pro zobrazení úkolů přiřazených členu
function displayAssignedTasks(memberId) {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || []; // Načteme úkoly z sessionStorage

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Vymažeme předchozí úkoly

    // Filtrujeme úkoly podle přiřazeného člena
    const assignedTasks = tasks.filter(task => task.assignedMembers.includes(memberId));

    if (assignedTasks.length === 0) {
        taskList.innerHTML = '<li>No tasks assigned</li>';
    } else {
        assignedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <p><em>Due: ${new Date(task.dueDate).toLocaleDateString()}</em></p>
            `;
            taskList.appendChild(taskItem);
        });
    }
}

// Zavolání funkce pro načtení údajů člena po načtení stránky
window.onload = getMemberDetails;
