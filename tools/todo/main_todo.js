// ============================================================================
// DATA
// ============================================================================
const btn = {
    allBtn: document.getElementById("allBtn"),
    activeBtn: document.getElementById("activeBtn"),
    completedBtn: document.getElementById("completedBtn"),
    deleteBtn: document.getElementById("deleteBtn"),
};

const ui = {
    userInput: document.getElementById("user-input"),
    error: document.getElementById("error"),
    list: document.getElementById("list-section"),
};

const state = {
    todoList: [],
    selected: null,
    btnSetting: "all",
};

// ============================================================================
// LISTENERS
// ============================================================================
document.addEventListener("keydown", addInput);

Object.values(btn).forEach((btn) => {
    btn.addEventListener("click", (e) => {
        deleteLine(e);
        setFilterBtn(e);
        render();
    });
});

ui.list.addEventListener("click", (e) => {
    setSelected(e);
    render();
});

// ============================================================================
// LOGIC
// ============================================================================
function addInput(e) {
    if (e.key !== "Enter") return;

    const isValid = ui.userInput.value.length > 0;
    toggleError(isValid);

    if (!isValid) return;

    addToList();
    render();
}

function toggleError(isValid) {
    if (!isValid) {
        ui.error.classList.remove("hidden");
        return;
    }

    ui.error.classList.add("hidden");
}

function addToList() {
    state.todoList.push({ id: String(Date.now()), data: ui.userInput.value, completed: false });
}

function setFilterBtn(e) {
    const id = e.target.dataset.id;
    let setting = "";

    if (!id) return;

    switch (id) {
        case "all":
            setting = "all";
            break;
        case "active":
            setting = "active";
            break;
        case "completed":
            setting = "completed";
            break;
    }

    state.btnSetting = setting;
}

function setSelected(e) {
    const row = e.target.closest(".line");
    if (!row) {
        state.selected = null;
        return;
    }

    const line = state.todoList.find((l) => l.id === row.dataset.id);
    if (!line) return;

    if (e.target.type === "checkbox") {
        line.completed = e.target.checked;
        return;
    }

    state.selected = state.selected && line.id === state.selected.id ? null : line;
}

function filterInput() {
    let list = state.todoList;

    if (state.btnSetting === "active") list = state.todoList.filter((line) => !line.completed);
    if (state.btnSetting === "completed") list = state.todoList.filter((line) => line.completed);

    return list;
}

function deleteLine(e) {
    const isDelete = e.target === btn.deleteBtn;
    if (!isDelete || !state.selected) return;

    const item = state.todoList.find((line) => line.id === state.selected.id);
    const idx = state.todoList.indexOf(item);

    state.todoList.splice(idx, 1);
    state.selected = null;
}

// ============================================================================
// RENDER
// ============================================================================
function renderTodoList() {
    ui.list.innerHTML = "";

    const fragment = document.createDocumentFragment();

    filterInput().forEach((line) => {
        const span = document.createElement("span");
        span.classList.add("line");
        span.dataset.id = line.id;

        if (state.selected && line.id === state.selected.id) {
            span.classList.add("lineSelected");
        }

        const mark = document.createElement("input");
        mark.type = "checkbox";
        mark.checked = line.completed;

        const div = document.createElement("div");
        div.classList.add("text");
        div.textContent = line.data;

        span.append(mark, div);
        fragment.append(span);
    });

    ui.list.append(fragment);
}

function resetUserInput() {
    ui.userInput.value = "";
}

function colorizeButtons() {
    Object.values(btn).forEach((btn) => {
        if (btn === deleteBtn) return;

        if (btn.dataset.id === state.btnSetting) {
            btn.classList.add("btnActive");
        } else {
            btn.classList.remove("btnActive");
        }
    });

    if (!state.selected) {
        btn.deleteBtn.classList.add("btnInactive");
    } else {
        btn.deleteBtn.classList.remove("btnInactive");
    }
}

function render() {
    renderTodoList();
    resetUserInput();
    colorizeButtons();
}

render();
