const params = new URLSearchParams(window.location.search);
const memberId = parseFloat(params.get('id')); // Get the member ID from the URL

// Retrieve the stored app data from localStorage
const appData = JSON.parse(localStorage.getItem('appData'));
const member = appData.teamMembers.find(m => m.id === memberId); // Find the member by ID

if (member) {
    // Display the member's name and role
    document.getElementById('member-name').textContent = `${member.name} - ${member.role}`;

    // Render the list of tasks assigned to the member
    const taskList = document.getElementById('task-list');
    appData.tasks.forEach(task => {
        if (task.assignedMembers.includes(memberId.toString())) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${task.title}</strong><p>Due: ${new Date(task.dueDate).toLocaleString()}</p>`;
            taskList.appendChild(li);
        }
    });

    // Render the received messages for the member
    const receivedMessages = document.getElementById('received-messages');
    member.messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.text} (${new Date(msg.timestamp).toLocaleString()})`;
        receivedMessages.appendChild(li);
    });
} else {
    // If the member is not found, display an error message
    document.body.innerHTML = '<h1>Member not found</h1>';
}
