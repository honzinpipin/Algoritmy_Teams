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
        this.teamMembers = JSON.parse(sessionStorage.getItem('teamMembers')) || [];  // Načte členy
        this.tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];  // Načte úkoly
        
        // DOM elements
        this.teamList = document.getElementById('team-list');
        this.taskList = document.getElementById('task-list');
        this.memberSelect = document.getElementById('task-members');
        
        this.initializeEventListeners();
        this.renderTeam(); // Načte seznam členů
        this.renderTasks(); // Načte seznam úkolů
        this.populateMemberOptions(); // Aktualizuje možnosti výběru pro úkoly
    }

    initializeEventListeners() {
        document.getElementById('add-member-form').addEventListener('submit', (e) => this.addMember(e));
        document.getElementById('add-task-form').addEventListener('submit', (e) => this.addTask(e));
    }

    addMember(event) {
        event.preventDefault(); // Prevent form submission
        const name = document.getElementById('member-name').value;
        const role = document.getElementById('member-role').value;

        const newMember = new Member(name, role);
        this.teamMembers.push(newMember);

        document.getElementById('member-name').value = ''; // Clear input field
        document.getElementById('member-role').value = ''; // Clear input field

        // Store members and tasks in sessionStorage
        sessionStorage.setItem('teamMembers', JSON.stringify(this.teamMembers));
        sessionStorage.setItem('tasks', JSON.stringify(this.tasks));

        this.renderTeam(); // Render updated member list
        this.populateMemberOptions(); // Update member select for task assignment
    }

    renderTeam() {
        // Clear previous member list
        this.teamList.innerHTML = '';
        this.teamMembers.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} - ${member.role}`;
            li.dataset.id = member.id; // Store member ID in data attribute
            li.addEventListener('click', () => this.openMemberDetails(member.id));
            this.teamList.appendChild(li);
        });
    }

    populateMemberOptions() {
        // Update member select options for task assignment
        this.memberSelect.innerHTML = ''; // Clear previous options
        this.teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id; // Set member ID as value
            option.textContent = member.name; // Display member name
            this.memberSelect.appendChild(option);
        });
    }

    addTask(event) {
        event.preventDefault(); // Prevent form submission
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('task-due-date').value;
        const assignedMembersIds = Array.from(document.getElementById('task-members').selectedOptions).map(option => option.value);

        const newTask = new Task(title, description, dueDate, assignedMembersIds);
        this.tasks.push(newTask);

        // Store updated tasks in sessionStorage
        sessionStorage.setItem('tasks', JSON.stringify(this.tasks));

        // Clear form inputs
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-due-date').value = '';

        this.renderTasks(); // Render updated task list
    }

    renderTasks() {
        // Clear previous task list
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            const assignedMembersDisplay = task.assignedMembers.map(memberId => {
                const member = this.teamMembers.find(m => m.id === parseFloat(memberId));
                return member ? member.name : '';
            }).join(', '); // Display member names instead of IDs

            li.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <p>Due: ${new Date(task.dueDate).toLocaleString()}</p>
                <p><em>Assigned to: ${assignedMembersDisplay}</em></p>
            `;
            this.taskList.appendChild(li);
        });
    }

    openMemberDetails(memberId) {
        // Redirect to member detail page with member ID in query string
        window.location.href = `member.html?memberId=${memberId}`;
    }
}

// Initialize app
const app = new TeamApp();
