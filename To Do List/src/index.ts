/**
 * Función de inicialización que se ejecuta cuando el DOM está completamente cargado.
 * - Realiza la selección de elementos importantes del DOM.
 * - Obtiene las tareas pendientes almacenadas localmente, si las hay.
 * - Establece los listeners de eventos para los botones y elementos .
 */
document.addEventListener("DOMContentLoaded", () => {
  // Selección de elementos del DOM
  const todoInput = document.querySelector(".todo-input") as HTMLInputElement;
  const todoButton = document.querySelector(".todo-button") as HTMLButtonElement;
  const todoList = document.querySelector(".todo-list") as HTMLUListElement;
  const filterOption = document.querySelector(".filter-todo") as HTMLSelectElement;

  // Llamada a getLocalTodos
  getLocalTodos();

  // Listeners de eventos
  todoButton?.addEventListener("click", (event) => addTodo(event, todoInput, todoList, (todo) => saveLocalTodos(todo, localStorage)));
  todoList?.addEventListener("click", (event) => deleteCheck(event as MouseEvent, removeLocalTodos));
  filterOption?.addEventListener("change", (e) => filterTodo(e, todoList?.childNodes));
});

// --- Funciones ---

/**
 * Función para agregar una nueva tarea a la lista.
 */
export function addTodo(event: Event, todoInput: HTMLInputElement, todoList: HTMLUListElement, saveLocalTodos: (value: string) => void): void {
  event.preventDefault();

  const todoDiv = document.createElement("div") as HTMLDivElement;
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li") as HTMLLIElement;
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  // Usamos la función saveLocalTodos pasada como argumento
  saveLocalTodos(todoInput.value);

  const completedButton = document.createElement("button") as HTMLButtonElement;
  completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  const trashButton = document.createElement("button") as HTMLButtonElement;
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  todoList.appendChild(todoDiv);
  todoInput.value = "";
}

/**
 * Función para eliminar o marcar como completada una tarea existente.
 */
export function deleteCheck(e: MouseEvent, removeLocalTodos: (todo: HTMLElement) => void): void {
  const item = e.target as HTMLElement;

  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement as HTMLElement;
    todo.classList.add("slide");

    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement as HTMLElement;
    todo.classList.toggle("completed");
  }
}

/**
 * Función para filtrar tareas basado en su estado de finalización.
 */
export function filterTodo(e: Event, todos: NodeListOf<ChildNode>): void {
  console.log("Función filterTodo activada"); // Verifica que la función se activa

  // Imprime el valor del elemento seleccionado
  console.log("Valor seleccionado:", (e.target as HTMLSelectElement).value);
  console.log("Todos: ", todos);
  todos.forEach(function (todo: ChildNode) {
    const htmlTodo = todo as HTMLElement; // Asumimos que cada "todo" es un HTMLElement
    switch ((e.target as HTMLSelectElement).value) {
      case "all":
        htmlTodo.style.display = "flex";
        break;
      case "completed":
        if (htmlTodo.classList.contains("completed")) {
          htmlTodo.style.display = "flex";
        } else {
          htmlTodo.style.display = "none";
        }
        break;
      case "incomplete":
        if (!htmlTodo.classList.contains("completed")) {
          htmlTodo.style.display = "flex";
        } else {
          htmlTodo.style.display = "none";
        }
        break;
    }
  });
}

/**
 * Función para guardar las tareas en el almacenamiento local.
 */
export function saveLocalTodos(todo: string, localStorage: Storage) {
  let todos: string[];

  const item = localStorage.getItem("todos");
  if (item !== null && item !== "undefined") {
    todos = JSON.parse(item);
  } else {
    todos = [];
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**
 * Función para obtener tareas del almacenamiento local.
 */
export function getLocalTodos(): string[] {
  let todos: string[] = [];

  const storedTodos = localStorage.getItem("todos");
  if (storedTodos !== null && storedTodos !== "undefined") {
    todos = JSON.parse(storedTodos);
  }

  return todos;
}

/**
 * Función para eliminar una tarea del almacenamiento local.
 */
export function removeLocalTodos(todo: HTMLElement): void {
  let todos: string[];
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos") as string);
  }

  const todoIndex: string = (todo.children[0] as HTMLElement).innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
