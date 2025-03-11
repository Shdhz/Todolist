document.addEventListener('DOMContentLoaded', function () {
    loadTasks();

    document.getElementById('taskInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});


function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const taskText = li.querySelector('span').textContent;
        const isChecked = li.querySelector('.task-checkbox').checked;
        tasks.push({ text: taskText, checked: isChecked });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTask(task.text, false, task.checked));
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

    // 📝 Membungkus Edit & Delete ke dalam Form
    const form = document.createElement('form');
    form.classList.add('task-form');

    // ✏️ Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.classList.add('edit');
    editButton.type = 'button';
    editButton.onclick = function () {
        if (editButton.textContent === '✏️') {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = span.textContent;
            editInput.classList.add('edit-input');

            li.replaceChild(editInput, span);
            editButton.textContent = '✔️';

            editInput.focus();

            editInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });

        } else {
            saveEdit();
        }
    };

    // Fungsi Simpan Edit
    function saveEdit() {
        const editInput = li.querySelector('.edit-input');
        if (editInput && editInput.value.trim() !== '') {
            span.textContent = editInput.value.trim();
            li.replaceChild(span, editInput);
            editButton.textContent = '✏️';
            saveTasks();
        }
    }

    // ❌ Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.type = 'submit';
    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
    `;
    

    form.onsubmit = function (e) {
        e.preventDefault();
        li.remove();
        saveTasks();
    };

    form.appendChild(editButton);
    form.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(form); 
    taskList.appendChild(li);

    if (save) saveTasks();
    input.value = '';
}
