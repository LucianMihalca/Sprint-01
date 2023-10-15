import { addTodo, deleteCheck, filterTodo, saveLocalTodos, getLocalTodos } from "../index";

// 1. Mock de localStorage con tipo Storage
let mockLocalStorage: Storage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as unknown as Storage;

// 2. Usar Object.defineProperty para asignar el mock a window.localStorage
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// 3. Prueba
it("1. should correctly mock localStorage", () => {
  const key = "someKey";
  const value = "someValue";

  // Usar el mock para setItem
  localStorage.setItem(key, value);

  // Comprobar que el mock fue llamado con los argumentos correctos
  expect(mockLocalStorage.setItem).toHaveBeenCalledWith(key, value);

  // Usar el mock para getItem
  localStorage.getItem(key);

  // Comprobar que el mock fue llamado con los argumentos correctos
  expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
});

// 4. Pruebas de saveLocalTodos function
describe("4. saveLocalTodos function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save todo to local storage", () => {
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(null);
    const todo = "Buy milk";
    saveLocalTodos(todo, mockLocalStorage);
    const expectedData = JSON.stringify([todo]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("todos", expectedData);
  });

  it("should append todo to existing todos in local storage", () => {
    const existingTodo = "Write tests";

    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify([existingTodo]));
    const newTodo = "Buy milk";
    saveLocalTodos(newTodo, mockLocalStorage);
    const expectedData = JSON.stringify([existingTodo, newTodo]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("todos", expectedData);
  });
});

// 5. Mock de la función removeLocalTodos
const removeLocalTodos = jest.fn((todo: HTMLElement) => {
  const todosData = JSON.parse(mockLocalStorage.getItem("todos") as string);
  const todoIndex: string = (todo.children[0] as HTMLElement).innerText;
  todosData.splice(todosData.indexOf(todoIndex), 1);
  mockLocalStorage.setItem("todos", JSON.stringify(todosData));
});

(globalThis as any).removeLocalTodos = removeLocalTodos;

// 6. Pruebas de removeLocalTodos function
describe("6. removeLocalTodos function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should remove a todo from localStorage", () => {
    // Configuramos el mock de localStorage para que contenga datos iniciales
    const initialTodosData = ["Buy milk", "Write tests"];
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(initialTodosData));

    // Crear un elemento de ejemplo que se pasará a la función
    const todoElement = document.createElement("div");
    const todoText = document.createElement("li");
    todoText.innerText = "Buy milk";
    todoElement.appendChild(todoText);

    // Llamar a la función para eliminar un todo
    removeLocalTodos(todoElement);

    // Verificar que se haya llamado a getItem del mock de localStorage con "todos"
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("todos");

    // Verificar que se haya llamado a setItem del mock de localStorage con los datos actualizados
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("todos", JSON.stringify(["Write tests"]));
  });
});

// 7. Pruebas de filterTodo
describe("7. filterTodo", () => {
  it("should filter todos based on the selected option", () => {
    // Configura el entorno del DOM
    document.body.innerHTML = `
          <ul id="todoList">
            <div class="todo completed"></div>
            <div class="todo"></div>
          </ul>
          <select id="filter">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        `;

    // Crea un evento falso para simular el evento que desencadena filterTodo
    const fakeEvent = new Event("change", {
      bubbles: true,
      cancelable: true,
    });

    // Configura el valor del select para simular una opción seleccionada
    const filterSelect = document.getElementById("filter") as HTMLSelectElement;
    filterSelect.value = "completed";
    filterSelect.dispatchEvent(fakeEvent);

    // Obtén la lista de todos y ejecuta la función filterTodo
    const todos = document.querySelectorAll(".todo");
    filterTodo(fakeEvent, todos);

    // Verifica si todo ha ido como esperamos
    todos.forEach((todo: Element) => {
      const htmlTodo = todo as HTMLElement; // Type assertion aquí
      if (htmlTodo.classList.contains("completed")) {
        expect(htmlTodo.style.display).toBe("flex"); // Ahora TypeScript debería estar contento
      } else {
        expect(htmlTodo.style.display).toBe("none"); // Ahora TypeScript debería estar contento
      }
    });
  });
});

// 8. Pruebas de getLocalTodos function
describe("8. getLocalTodos function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar todos los mocks antes de cada prueba
  });

  it("should return an empty array when localStorage is empty", () => {
    // Simula que getItem devuelva null
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    // Llamamos a la función sin datos en localStorage
    const result = getLocalTodos();

    // Verificamos que devuelva un array vacío
    expect(result).toEqual([]);
  });

  it("should return todos from localStorage", () => {
    // Datos de prueba que queremos que se devuelvan desde localStorage
    const todosData = ["Buy milk", "Write tests"];

    // Simula que getItem devuelva esos datos de prueba
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(todosData));

    // Llamamos a la función
    const result = getLocalTodos();

    // Verificamos que devuelva los datos correctos
    expect(result).toEqual(todosData);
  });
});
