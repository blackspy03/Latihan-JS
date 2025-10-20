var STORAGE_KEY = 'todoList.tasks'; // key used in localStorage
var tasks = []; // in-memory task list

// Save tasks array to localStorage (browser "cache")
function saveTasks() {
    try {
        // stringify and persist
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
        // storage may fail (quota, private mode) — warn but keep app running
        console.warn('Failed to save tasks', err);
    }
}

// Load tasks from localStorage and render them
function loadTasks() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // nothing saved yet

    try {
        // parse persisted tasks (fallback to empty array)
        tasks = JSON.parse(raw) || [];
    } catch (err) {
        // corrupted JSON -> reset tasks to empty
        tasks = [];
        console.warn('Corrupted tasks in storage, resetting', err);
    }

    // render each saved task into the DOM
    tasks.forEach(renderTask);
}

// Render a single task object into the UL
function renderTask(task) {
    var list = document.getElementById("todo-list");

    // create LI and give it bootstrap + accessibility attributes
    var listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex align-items-center";
    listItem.setAttribute('data-id', task.id);

    // create checkbox and set its state from task.checked
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";
    checkbox.checked = !!task.checked; // cast to boolean

    // text span for the todo
    var span = document.createElement("span");
    span.textContent = task.text;
    // if saved as checked, show visual strike-through
    if (checkbox.checked) {
        span.classList.add("text-decoration-line-through", "text-muted");
    }

    // delete button (trash icon)
    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button"; // important to avoid submitting a form
    deleteBtn.className = "btn btn-sm btn-danger ms-auto";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.setAttribute("aria-label", "Delete task");

    // Delete click handler
    deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // prevent LI click handler from also running
        listItem.remove(); // remove from DOM

        // remove from tasks array and persist
        tasks = tasks.filter(function (t) { return t.id !== task.id; });
        saveTasks();
    });

    // When checkbox changes (user action or programmatic), update UI and persist
    checkbox.addEventListener("change", function () {
        if (this.checked) {
            span.classList.add("text-decoration-line-through", "text-muted"); // visual checked
        } else {
            span.classList.remove("text-decoration-line-through", "text-muted");
        }

        // update corresponding task in memory and save
        var t = tasks.find(function (x) { return x.id === task.id; });
        if (t) {
            t.checked = this.checked;
            saveTasks();
        }
    });

    // Prevent checkbox click from bubbling to the LI.
    // Without this, clicking the checkbox would bubble up and the LI handler might toggle it again.
    checkbox.addEventListener('click', function (e) { e.stopPropagation(); });

    // Clicking the LI toggles the checkbox (so clicking the text checks/unchecks)
    listItem.addEventListener("click", function (e) {
        // if the click started on the checkbox or a button, ignore here
        if (e.target === checkbox || e.target.closest('button')) return;

        // Simulate a user click on the checkbox:
        // checkbox.click() toggles the checked state AND fires click+change events automatically.
        // This is why we don't need to set checkbox.checked + dispatchEvent manually here.
        checkbox.click();
    });

    // assemble and append
    listItem.appendChild(checkbox);
    listItem.appendChild(span);
    listItem.appendChild(deleteBtn);
    list.appendChild(listItem);
}

// Add a new task from the input
function addList() {
    var inputEl = document.getElementById("todo-input");
    var input = inputEl.value.trim(); // snapshot value (so clearing inputEl doesn't affect it)
    if (!input) return;

    // create task object with unique id
    var task = {
        id: Date.now(), // simple unique id
        text: input,
        checked: false
    };

    // store, persist, render, then clear input
    tasks.push(task);
    saveTasks();
    renderTask(task);

    inputEl.value = "";
    inputEl.focus();
}

// Initialize on page load: load persisted tasks
window.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

