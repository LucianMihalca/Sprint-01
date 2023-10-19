/**
 * Función de inicialización que se ejecuta cuando el DOM está completamente cargado.
 * - Realiza la selección de elementos importantes del DOM.
 * - Obtiene las tareas pendientes almacenadas localmente, si las hay.
 * - Establece los listeners de eventos para los botones y elementos .
 */
document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos del DOM
    const todoInput = document.querySelector(".todo-input");
    const todoButton = document.querySelector(".todo-button");
    const todoList = document.querySelector(".todo-list");
    const filterOption = document.querySelector(".filter-todo");
    // Llamada a getLocalTodos
    getLocalTodos();
    // Listeners de eventos
    todoButton === null || todoButton === void 0 ? void 0 : todoButton.addEventListener("click", (event) => addTodo(event, todoInput, todoList, (todo) => saveLocalTodos(todo, localStorage)));
    todoList === null || todoList === void 0 ? void 0 : todoList.addEventListener("click", (event) => deleteCheck(event, removeLocalTodos));
    filterOption === null || filterOption === void 0 ? void 0 : filterOption.addEventListener("change", (e) => filterTodo(e, todoList === null || todoList === void 0 ? void 0 : todoList.childNodes));
});
// --- Funciones ---
/**
 * Función para agregar una nueva tarea a la lista.
 */
export function addTodo(event, todoInput, todoList, saveLocalTodos) {
    event.preventDefault();
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    // Usamos la función saveLocalTodos pasada como argumento
    saveLocalTodos(todoInput.value);
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    todoList.appendChild(todoDiv);
    todoInput.value = "";
}
/**
 * Función para eliminar o marcar como completada una tarea existente.
 */
export function deleteCheck(e, removeLocalTodos) {
    const item = e.target;
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }
    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}
/**
 * Función para filtrar tareas basado en su estado de finalización.
 */
export function filterTodo(e, todos) {
    console.log("Función filterTodo activada"); // Verifica que la función se activa
    // Imprime el valor del elemento seleccionado
    console.log("Valor seleccionado:", e.target.value);
    console.log("Todos: ", todos);
    todos.forEach(function (todo) {
        const htmlTodo = todo; // Asumimos que cada "todo" es un HTMLElement
        switch (e.target.value) {
            case "all":
                htmlTodo.style.display = "flex";
                break;
            case "completed":
                if (htmlTodo.classList.contains("completed")) {
                    htmlTodo.style.display = "flex";
                }
                else {
                    htmlTodo.style.display = "none";
                }
                break;
            case "incomplete":
                if (!htmlTodo.classList.contains("completed")) {
                    htmlTodo.style.display = "flex";
                }
                else {
                    htmlTodo.style.display = "none";
                }
                break;
        }
    });
}
/**
 * Función para guardar las tareas en el almacenamiento local.
 */
export function saveLocalTodos(todo, localStorage) {
    let todos;
    const item = localStorage.getItem("todos");
    if (item !== null && item !== "undefined") {
        todos = JSON.parse(item);
    }
    else {
        todos = [];
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}
/**
 * Función para obtener tareas del almacenamiento local.
 */
export function getLocalTodos() {
    let todos = [];
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos !== null && storedTodos !== "undefined") {
        todos = JSON.parse(storedTodos);
    }
    return todos;
}
/**
 * Función para eliminar una tarea del almacenamiento local.
 */
export function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}
