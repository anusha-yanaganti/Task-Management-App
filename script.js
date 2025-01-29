const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filters = document.querySelector('.filters');
const submitButton = taskForm.querySelector('button[type="submit"]');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editTaskId = null; 

/// Function to update task count in filter buttons
function updateTaskCount() {
    const allCount = tasks.length;
    const completedCount = tasks.filter(task => task.status === 'completed').length;
    const pendingCount = tasks.filter(task => task.status === 'pending').length;
    const highCount = tasks.filter(task => task.priority === 'high').length;
    const mediumCount = tasks.filter(task => task.priority === 'medium').length;
    const lowCount = tasks.filter(task => task.priority === 'low').length;
  
    // Update the filter buttons with task counts
    document.querySelector('.filter-all').textContent = `All (${allCount})`;
    document.querySelector('.filter-completed').textContent = `Completed (${completedCount})`;
    document.querySelector('.filter-pending').textContent = `Pending (${pendingCount})`;
    document.querySelector('.filter-high').textContent = `High Priority (${highCount})`;
    document.querySelector('.filter-medium').textContent = `Medium Priority (${mediumCount})`;
    document.querySelector('.filter-low').textContent = `Low Priority (${lowCount})`;
}


function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    if (['high', 'medium', 'low'].includes(filter)) return task.priority === filter;
  });

  filteredTasks.forEach(task => {
    const [year, month, day] = task.dueDate.split('-');
    const formattedDueDate = `${day}-${month}-${year}`;

    const li = document.createElement('li');
    li.className = `task-item ${task.status}`;
    li.innerHTML = `
   <button onclick="toggleStatus(${task.id})" class="complete-btn">
  <i class="fas ${task.status === 'pending' ? 'fa-circle' : 'fa-check-circle'}"></i>
</button>

      <div class="task-content">
        <p class="task-name">${task.name}</p>
        <p class="task-due-date">Due: ${formattedDueDate}</p>
        <p class="task-priority">Priority: ${task.priority}</p>
      </div>
      <div class="task-actions">
        <button class="edit" onclick="editTask(${task.id})">
          <i class="fas fa-edit"></i>
        </button>
        
        <button onclick="deleteTask(${task.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    
    taskList.appendChild(li);

    const colors = [ "#9966CC","#DDA0DD",  "#a27eed","#dbc0f5", "#baa0ff"]; // Array of colors

document.querySelectorAll(".task-item").forEach((item, index) => {
  const colorIndex = index % colors.length; // Ensure looping through colors
  const selectedColor = colors[colorIndex]; // Get the color from the array
  
  // Log to verify the color is being set
  console.log(`Setting color ${selectedColor} for task item ${index + 1}`);
  
  item.style.setProperty("--task-border-color", selectedColor); // Apply the color to the CSS variable
});


  });
  
updateTaskCount();
}

function addTask(e) {
  e.preventDefault();
  const name = document.getElementById('task-name').value;
  const priority = document.getElementById('task-priority').value;
  const dueDate = document.getElementById('task-due-date').value;

  if (!name || !dueDate) return alert('Please fill out all fields.');

  const newTask = {
    id: Date.now(),
    name,
    priority,
    dueDate,
    status: 'pending'
  };

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  
  renderTasks();

  
}

function updateTask(e) {
  e.preventDefault();
  const name = document.getElementById('task-name').value;
  const priority = document.getElementById('task-priority').value;
  const dueDate = document.getElementById('task-due-date').value;

  if (!name || !dueDate) return alert('Please fill out all fields.');

  tasks = tasks.map(task => 
    task.id === editTaskId ? { ...task, name, priority, dueDate } : task
  );

  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  submitButton.textContent = 'Add Task';
  submitButton.onclick = addTask;
  editTaskId = null;
  renderTasks();
}

function toggleStatus(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' } : task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-due-date').value = task.dueDate;
    submitButton.textContent = 'Update Task';
    // submitButton.onclick = updateTask;
    submitButton.onclick = e => {
        e.preventDefault();
        // Update task data
        task.name = document.getElementById('task-name').value;
        task.priority = document.getElementById('task-priority').value;
        task.dueDate = document.getElementById('task-due-date').value;
  
        // If the task was marked as 'completed,' reset its status to 'pending'
        if (task.status === 'completed') {
          task.status = 'pending';
        }
  
        // Save changes and re-render tasks
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskForm.reset();
        submitButton.textContent = 'Add Task';
        submitButton.onclick = addTask;
        renderTasks();
      };
    editTaskId = id;
  }
}

taskForm.addEventListener('submit', addTask);

filters.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    renderTasks(e.target.dataset.filter);
  }
 }
);
renderTasks();
