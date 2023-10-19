import inquirer from "inquirer";

type Todo = {
  description: string;
  completed: boolean;
};

// Inicializa un array vacío para guardar las tareas
let todos: Todo[] = [];

const saveTodos = (): void => {};

const showMenu = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "¿Qué te gustaría hacer?",
        choices: ["Añadir tarea", "Eliminar tarea", "Modificar tarea", "Marcar como completada", "Listar tareas", "Salir"],
      },
    ])
    .then((answers: { action: string }) => {
      switch (answers.action) {
        case "Añadir tarea":
          addTodo();
          break;
        case "Eliminar tarea":
          removeTodo();
          break;
        case "Modificar tarea":
          modifyTodo();
          break;
        case "Marcar como completada":
          markCompleted();
          break;
        case "Listar tareas":
          listTodos();
          break;
        case "Salir":
          saveTodos();
          process.exit();
          break;
      }
    });
};

const addTodo = (): void => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "description",
        message: "Introduce la nueva Tarea:",
      },
    ])
    .then((answers: { description: string }) => {
      todos.push({ description: answers.description, completed: false });
      saveTodos();
      showMenu();
    });
};

const removeTodo = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "todo",
        message: "Elige la tarea para eliminar:",
        choices: [...todos.map((todo) => todo.description), "Volver al menú"],
      },
    ])
    .then((answers: { todo: string }) => {
      if (answers.todo !== "Volver al menú") {
        inquirer
          .prompt([
            {
              type: "confirm",
              name: "confirm",
              message: `¿Estás seguro de que quieres eliminar la tarea "${answers.todo}"?`,
            },
          ])
          .then((confirmAnswers: { confirm: boolean }) => {
            if (confirmAnswers.confirm) {
              todos = todos.filter((todo) => todo.description !== answers.todo);
              saveTodos();
            }
            showMenu();
          });
      } else {
        showMenu();
      }
    });
};

const modifyTodo = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "todo",
        message: "Elige la tarea para modificar:",
        choices: [...todos.map((todo) => todo.description), "Volver al menú"],
      },
      {
        type: "input",
        name: "newDescription",
        message: "Introduce el nuevo texto de la tarea:",
        when: (answers: { todo: string }) => answers.todo !== "Volver al menú",
      },
    ])
    .then((answers: { todo: string; newDescription?: string }) => {
      if (answers.todo !== "Volver al menú") {
        inquirer
          .prompt([
            {
              type: "confirm",
              name: "confirm",
              message: `¿Estás seguro de que quieres modificar la tarea "${answers.todo}"?`,
            },
          ])
          .then((confirmAnswers: { confirm: boolean }) => {
            if (confirmAnswers.confirm && answers.newDescription !== undefined) {
              const todo = todos.find((t) => t.description === answers.todo);
              if (todo) {
                todo.description = answers.newDescription;
                saveTodos();
              }
            }
            showMenu();
          });
      } else {
        showMenu();
      }
    });
};

const markCompleted = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "todo",
        message: "Elige la tarea para marcar como completada:",
        choices: [...todos.map((todo) => todo.description), "Volver al menú"],
      },
    ])
    .then((answers: { todo: string }) => {
      if (answers.todo !== "Volver al menú") {
        const todo = todos.find((t) => t.description === answers.todo);
        if (todo) {
          todo.completed = true;
        }
        saveTodos();
      }
      showMenu();
    });
};

const listTodos = (): void => {
  console.log("\nTareas pendientes:");
  todos.forEach((todo, index) => {
    const status = todo.completed ? "Completada" : "Pendiente";
    console.log(`${index + 1}. ${todo.description} - ${status}`);
  });
  console.log("");
  showMenu();
};

showMenu();
