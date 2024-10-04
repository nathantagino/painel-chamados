document.getElementById('add-task-btn').addEventListener('click', function() {
    document.getElementById('task-form').classList.toggle('hidden');
});

document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dateInput = document.getElementById('task-date').value;
    const technician = document.querySelector('.task-selection').value; // Captura o técnico escolhido
    let formattedDate = '';

    if (dateInput) {
        const date = new Date(dateInput);
        formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    addTask(title, description, formattedDate, technician, false); // Passa o técnico para a função
    document.getElementById('task-form').reset();
    document.getElementById('task-form').classList.add('hidden');
});

function addTask(title, description, date, technician, isCompleted) {
    const taskList = isCompleted ? document.getElementById('task-list-completed') : document.getElementById('task-list-in-progress');
    const li = document.createElement('li');

    // Se não houver data, o campo de data será omitido
    const dateHTML = date ? `<small>${date}</small>` : '';

    li.innerHTML = `
        <div class="task-details">
            <strong>${title}</strong>
            <p>${description}</p>
            <p><small>Técnico: ${technician}</small></p> <!-- Adiciona o técnico -->
            ${dateHTML}
        </div>
        <div>
            ${!isCompleted ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-undo"></i>'}
            <i class="fas fa-edit"></i>
            <i class="fas fa-trash"></i>
        </div>
    `;
    taskList.appendChild(li);
    bindTaskActions(li, title, description, date, technician, isCompleted); // Passa o técnico para as ações da tarefa
}

function bindTaskActions(li, title, description, date, technician, isCompleted) {
    const editButton = li.querySelector('.fa-edit');
    const deleteButton = li.querySelector('.fa-trash');
    const toggleCompleteButton = li.querySelector(isCompleted ? '.fa-undo' : '.fa-check-circle');

    editButton.addEventListener('click', function() {
        const newTitle = prompt('Edit title:', title);
        const newDescription = prompt('Edit description:', description);
        const newTechnician = prompt('Edit technician:', technician); // Permite editar o técnico
        if (newTitle && newDescription) {
            li.querySelector('.task-details strong').textContent = newTitle;
            li.querySelector('.task-details p').textContent = newDescription;
            li.querySelector('.task-details small').textContent = `Técnico: ${newTechnician}`; // Atualiza o técnico
        }
    });

    deleteButton.addEventListener('click', function() {
        li.remove();
    });

    if (toggleCompleteButton) {
        toggleCompleteButton.addEventListener('click', function() {
            li.remove();
            addTask(title, description, date, technician, !isCompleted); // Passa o técnico
        });
    }
}

// Funções de ordenação
document.getElementById('sort-tasks-in-progress').addEventListener('click', function() {
    sortTasks('task-list-in-progress');
});

document.getElementById('sort-tasks-completed').addEventListener('click', function() {
    sortTasks('task-list-completed');
});

function sortTasks(listId) {
    const list = document.getElementById(listId);
    const tasks = Array.from(list.getElementsByTagName('li'));
    tasks.sort((a, b) => {
        const dateA = new Date(a.querySelector('small')?.textContent.split(' ')[0].split('/').reverse().join('-') + ' ' + a.querySelector('small')?.textContent.split(' ')[1]);
        const dateB = new Date(b.querySelector('small')?.textContent.split(' ')[0].split('/').reverse().join('-') + ' ' + b.querySelector('small')?.textContent.split(' ')[1]);
        return dateB - dateA;
    });
    tasks.forEach(task => list.appendChild(task));
}
