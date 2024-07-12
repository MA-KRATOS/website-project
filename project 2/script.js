document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const rescheduleModal = document.getElementById('rescheduleModal');
    const newDeadlineInput = document.getElementById('newDeadlineInput');
    const updateDeadlineBtn = document.getElementById('updateDeadlineBtn');
    const cancelRescheduleBtn = document.getElementById('cancelRescheduleBtn');
    const closeBtn = document.querySelector('.closeBtn');
    let currentTask = null;

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskCategory = categoryInput.value;
        const taskDeadline = deadlineInput.value;
        const taskPriority = priorityInput.value;

        if (taskText !== "") {
            addTask(taskText, taskCategory, taskDeadline, taskPriority);
            taskInput.value = '';
            categoryInput.value = 'General';
            deadlineInput.value = '';
            priorityInput.value = 'Low';
        }
    });

    filterCategory.addEventListener('change', filterTasks);
    filterStatus.addEventListener('change', filterTasks);
    closeBtn.addEventListener('click', closeModal);
    cancelRescheduleBtn.addEventListener('click', closeModal);

    updateDeadlineBtn.addEventListener('click', () => {
        if (currentTask) {
            const newDeadline = newDeadlineInput.value;
            currentTask.dataset.deadline = newDeadline;
            currentTask.querySelector('.task-info span:nth-child(2)').textContent = `Deadline: ${new Date(newDeadline).toLocaleString()}`;
            updateCountdowns();
            closeModal();
        }
    });

    function addTask(text, category, deadline, priority) {
        const li = document.createElement('li');
        li.dataset.category = category;
        li.dataset.status = 'Incomplete';
        li.dataset.priority = priority;
        li.dataset.deadline = deadline;
        
        li.classList.add(category.toLowerCase());
        
        const countdown = getCountdown(deadline);

        li.innerHTML = `
            <div class="task-details">
                <span>${text}</span>
                <div>
                    <button class="rescheduleBtn">Reschedule</button>
                    <button class="removeBtn">Remove</button>
                </div>
            </div>
            <div class="task-info">
                <span>Category: ${category}</span>
                <span>Deadline: ${new Date(deadline).toLocaleString()}</span>
                <span class="priority-container ${priority.toLowerCase()}">${priority}</span>
                <span class="countdown">${countdown}</span>
            </div>
        `;

        const removeBtn = li.querySelector('.removeBtn');
        removeBtn.addEventListener('click', () => {
            taskList.removeChild(li);
        });

        const rescheduleBtn = li.querySelector('.rescheduleBtn');
        rescheduleBtn.addEventListener('click', () => {
            currentTask = li;
            newDeadlineInput.value = li.dataset.deadline;
            openModal();
        });

        li.addEventListener('click', (event) => {
            if (event.target.tagName !== 'BUTTON') {
                li.classList.toggle('completed');
                li.dataset.status = li.classList.contains('completed') ? 'Completed' : 'Incomplete';
                filterTasks();
            }
        });

        taskList.appendChild(li);
        filterTasks();
        updateCountdowns();
    }

    function filterTasks() {
        const categoryFilter = filterCategory.value;
        const statusFilter = filterStatus.value;

        Array.from(taskList.children).forEach(task => {
            const matchesCategory = categoryFilter === 'All' || task.dataset.category === categoryFilter;
            const matchesStatus = statusFilter === 'All' || task.dataset.status === statusFilter;

            if (matchesCategory && matchesStatus) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function getCountdown(deadline) {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diff = deadlineDate - now;

        if (diff <= 0) {
            return 'Expired';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    function updateCountdowns() {
        setInterval(() => {
            Array.from(taskList.children).forEach(task => {
                const deadline = task.dataset.deadline;
                const countdown = getCountdown(deadline);
                task.querySelector('.countdown').textContent = countdown;
            });
        }, 1000);
    }

    function openModal() {
        rescheduleModal.style.display = 'flex';
    }

    function closeModal() {
        rescheduleModal.style.display = 'none';
        currentTask = null;
    }
});
