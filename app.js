class Member {
    constructor(name, role) {
        this.id = Date.now() + Math.random(); // Unique ID for each member
        this.name = name;
        this.role = role;
    }
}

class Task {
    constructor(title, description, dueDate, assignedMembers) {
        this.id = Date.now() + Math.random();
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.assignedMembers = assignedMembers; // Array of member IDs
    }
}

class TeamApp {
    constructor() {
        this.teamMembers = [];
        this.tasks = [];
        
        // DOM elements
        this.teamList = document.getElementById('team-list');
        this.taskList = document.getElementById('task-list');
        this.memberSelect = document.getElementById('task-members');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('add-member-form').addEventListener('submit', (e) => this.addMember(e));
        document.getElementById('add-task-form').addEventListener('submit', (e) => this.addTask(e));
    }

    addMember(event) {
        event.preventDefault(); // Zabraňuje odeslání formuláře
        const name = document.getElementById('member-name').value;
        const role = document.getElementById('member-role').value;

        const newMember = new Member(name, role);
        this.teamMembers.push(newMember);

        document.getElementById('member-name').value = ''; // Vymazání formulářového pole
        document.getElementById('member-role').value = ''; // Vymazání formulářového pole

        this.renderTeam(); // Zobrazení aktualizovaného seznamu členů
        this.populateMemberOptions(); // Aktualizace výběru členů v poli "Assign Members"
    }

    renderTeam() {
        // Vymazání předchozího seznamu členů
        this.teamList.innerHTML = '';
        this.teamMembers.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} - ${member.role}`;
            this.teamList.appendChild(li);
        });
    }

    populateMemberOptions() {
        // Aktualizace výběru členů pro přiřazování úkolů
        const memberSelect = document.getElementById('task-members');
        memberSelect.innerHTML = ''; // Vymazání předchozích možností
        this.teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id; // Hodnota bude ID člena
            option.textContent = member.name; // Text bude jméno člena
            memberSelect.appendChild(option);
        });
    }

    addTask(event) {
        event.preventDefault(); // Zabraňuje odeslání formuláře
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('task-due-date').value;
        const assignedMembersIds = Array.from(document.getElementById('task-members').selectedOptions).map(option => option.value);

        // Převod ID na jména členů
        const assignedMembersNames = assignedMembersIds.map(id => {
            const member = this.teamMembers.find(member => member.id === parseFloat(id));
            return member ? member.name : 'Unknown';
        });

        const newTask = new Task(title, description, dueDate, assignedMembersIds);
        this.tasks.push(newTask);

        // Vymazání formulářových polí po odeslání
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-due-date').value = '';

        this.renderTasks(assignedMembersNames); // Zobrazení úkolů s jmény členů
    }

    renderTasks(assignedMembersNames) {
        // Vymazání předchozího seznamu úkolů
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            const assignedMembersDisplay = task.assignedMembers.map(memberId => {
                const member = this.teamMembers.find(m => m.id === parseFloat(memberId));
                return member ? member.name : '';
            }).join(', '); // Zobrazí jména členů namísto ID

            li.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <p>Due: ${new Date(task.dueDate).toLocaleString()}</p>
                <p><em>Assigned to: ${assignedMembersDisplay}</em></p>
            `;
            this.taskList.appendChild(li);
        });
    }
}

// Initialize app
const app = new TeamApp();