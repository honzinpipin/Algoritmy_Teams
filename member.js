function getMemberDetails() {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId');

    const members = JSON.parse(sessionStorage.getItem('teamMembers')) || [];

    const member = members.find(m => m.id === parseFloat(memberId));

    if (member) {
        document.getElementById('member-name').textContent = member.name;
        document.getElementById('member-role').textContent = member.role;
        document.getElementById('member-email').textContent = member.email || 'No email provided';

        displayAssignedTasks(memberId);
    } else {
        document.getElementById('member-name').textContent = 'Member not found';
        document.getElementById('member-role').textContent = 'N/A';
    }
}

function displayAssignedTasks(memberId) {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

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

window.onload = getMemberDetails;
