class Member {
    constructor(name, role) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.role = role;
        this.email = ''; 
    }
}

class Task {
    constructor(title, description, dueDate, assignedMembers) {
        this.id = Date.now() + Math.random();
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.assignedMembers = assignedMembers;
        this.isCompleted = false;
    }
}

class TeamApp {
    constructor() {
        this.teamMembers = JSON.parse(sessionStorage.getItem('teamMembers')) || [];
        this.tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
        
        this.teamList = document.getElementById('team-list');
        this.taskList = document.getElementById('task-list');
        this.memberSelect = document.getElementById('task-members');
        
        this.currentDate = new Date();
        
        this.initializeEventListeners();
        this.renderTeam();
        this.renderTasks();
        this.populateMemberOptions();
    }

    initializeEventListeners() {
        document.getElementById('add-member-form').addEventListener('submit', (e) => this.addMember(e));
        document.getElementById('add-task-form').addEventListener('submit', (e) => this.addTask(e));
    }

    addMember(event) {
        event.preventDefault();
        const name = document.getElementById('member-name').value;
        const role = document.getElementById('member-role').value;

        const newMember = new Member(name, role);
        this.teamMembers.push(newMember);

        document.getElementById('member-name').value = '';
        document.getElementById('member-role').value = '';

        sessionStorage.setItem('teamMembers', JSON.stringify(this.teamMembers));
        sessionStorage.setItem('tasks', JSON.stringify(this.tasks));

        this.renderTeam();
        this.populateMemberOptions();
    }

    renderTeam() {
        this.teamList.innerHTML = '';
        this.teamMembers.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} - ${member.role}`;
            li.dataset.id = member.id;
            li.addEventListener('click', () => this.openMemberDetails(member.id));
            this.teamList.appendChild(li);
        });
    }

    populateMemberOptions() {
        this.memberSelect.innerHTML = '';
        this.teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            this.memberSelect.appendChild(option);
        });
    }

    addTask(event) {
        event.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('task-due-date').value;
        const assignedMembersIds = Array.from(document.getElementById('task-members').selectedOptions).map(option => option.value);

        const newTask = new Task(title, description, dueDate, assignedMembersIds);
        this.tasks.push(newTask);

        sessionStorage.setItem('tasks', JSON.stringify(this.tasks));

        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-due-date').value = '';

        this.renderTasks();
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            const assignedMembersDisplay = task.assignedMembers.map(memberId => {
                const member = this.teamMembers.find(m => m.id === parseFloat(memberId));
                return member ? member.name : '';
            }).join(', ');

            const isOverdue = !task.isCompleted && this.currentDate > task.dueDate;

            li.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <p>Due: ${new Date(task.dueDate).toLocaleString()}</p>
                <p><em>Assigned to: ${assignedMembersDisplay}</em></p>
                <button class="complete-task-btn" data-task-id="${task.id}">
                    ${task.isCompleted ? 'Task Completed' : 
                      (isOverdue ? 'Task Not Submitted' : 'Mark as Completed')}
                </button>
            `;

            if (task.isCompleted) {
                li.classList.add('completed');
                li.style.backgroundColor = '#d4edda';
                li.querySelector('.complete-task-btn').disabled = true;
            } else if (isOverdue) {
                li.style.backgroundColor = '#ffe6e6';
            }

            li.querySelector('.complete-task-btn').addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                this.markTaskAsCompleted(taskId);
            });

            this.taskList.appendChild(li);
        });
    }

    markTaskAsCompleted(taskId) {
        const task = this.tasks.find(t => t.id === parseFloat(taskId));
        if (task) {
            task.isCompleted = true;
            sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.renderTasks();
        }
    }

    updateCurrentDate(newDate) {
        this.currentDate = newDate;
        this.renderTasks();
    }

    openMemberDetails(memberId) {
        window.location.href = `member.html?memberId=${memberId}`;
    }
}

const app = new TeamApp();
