document.addEventListener('DOMContentLoaded', loadTasks);

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li span').forEach(task => {
        tasks.push(task.textContent);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTask(task, false));
}

function addTask(taskText = null, save = true, checked = false) {
    const input = document.getElementById('taskInput');
    const task = taskText || input.value.trim();
    if (task === '') return;

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');

    // ✅ Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = checked;
    checkbox.onclick = function () {
        if (checkbox.checked) {
            span.classList.add('completed');
        } else {
            span.classList.remove('completed');
        }
        saveTasks();
    };

    const span = document.createElement('span');
    span.textContent = task;
    if (checked) span.classList.add('completed');

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    // ✏️ Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.classList.add('edit');
    editButton.onclick = function () {
        if (editButton.textContent === '✏️') {
            // Masuk ke mode edit
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = span.textContent;
            editInput.classList.add('edit-input');

            li.replaceChild(editInput, span);
            editButton.textContent = '✔️'; // Ubah ikon ke simpan

            editInput.focus(); // Fokus otomatis ke input

            editInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });

        } else {
            // Simpan perubahan
            saveEdit();
        }
    };

    // Fungsi Simpan Edit
    function saveEdit() {
        const editInput = li.querySelector('.edit-input');
        if (editInput && editInput.value.trim() !== '') {
            span.textContent = editInput.value.trim();
            li.replaceChild(span, editInput);
            editButton.textContent = '✏️'; // Kembali ke mode edit
            saveTasks();
        }
    }


    // ❌ Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.classList.add('delete');
    deleteButton.onclick = function () {
        li.remove();
        saveTasks();
    };

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actionsDiv);
    taskList.appendChild(li);
    if (save) saveTasks();
    input.value = '';
}