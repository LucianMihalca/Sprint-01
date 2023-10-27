import inquirer from "inquirer";
import  ToDo  from "./logica.cli.js";

const todoManager = new ToDo();

process.on("SIGINT", () => {
  // Realiza las tareas de limpieza aquí, si las hay.
  saveTodos();
  // Finaliza el proceso
  process.exit();
});

type ModifyTodoAnswers = {
  todo: string;
  newDescription?: string; 
};

type Todo = {
  description: string;
  completed: boolean;
};

// Inicializa un array vacío para guardar las tareas
// let todos: Todo[] = [];

const saveTodos = (): void => {};

const showMenu = (): void => {
  console.clear(); // Borra la pantalla de la terminal
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
          console.log("Saliendo de la aplicación...");
          process.kill(process.pid, "SIGINT");
          break;
      }
    });
};

const addTodo = (): void => {
  console.clear(); // Limpiar la consola antes de mostrar el prompt
  inquirer
    .prompt([
      {
        type: "input",
        name: "description",
        message: "Introduce la nueva Tarea:",
      },
      {
        type: "list",
        name: "nextAction",
        choices: ["Añadir otra tarea", "Volver al menú principal"],
      },
    ])

    .then((answers: { description: string; nextAction: string }) => {
      todoManager.addTodo(answers.description);
      saveTodos();
      if (answers.nextAction === "Añadir otra tarea") {
        addTodo(); // Llamada recursiva para seguir añadiendo tareas
      } else {
        showMenu();
      }
    });

  
};

const removeTodo = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "todo",
        message: "Elige la tarea para eliminar:",
        choices: [...todoManager.todos.map((todo) => todo.description), "Volver al menú"],
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
              todoManager.removeTodo(answers.todo);
              saveTodos();
            }
            showMenu();
          });
      } else {
        showMenu();
      }
      //     .then((confirmAnswers: { confirm: boolean }) => {
      //       if (confirmAnswers.confirm) {
      //         todos = todos.filter((todo) => todo.description !== answers.todo);
      //         saveTodos();
      //       }
      //       showMenu();
      //     });
      // } else {
      //   showMenu();
      // }
    });
};

const modifyTodo = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "todo",
        message: "Elige la tarea para modificar:",
        choices: [...todoManager.todos.map((todo) => todo.description), "Volver al menú"],
      },
      {
        type: "input",
        name: "newDescription",
        message: "Introduce el nuevo texto de la tarea:",
        when: (answers: { todo: string }) => answers.todo !== "Volver al menú",
      },
    ])
    .then((answers: ModifyTodoAnswers) => {
      if (answers.todo !== "Volver al menú") {
        inquirer
          .prompt([
            // Confirmación aquí
          ])
          .then((confirmAnswers) => {
            if (confirmAnswers.confirm && answers.newDescription !== undefined) {
              todoManager.modifyTodo(answers.todo, answers.newDescription); // Utiliza el método de todoManager
              showMenu();
            }
          });
      } else {
        showMenu();
      }
    });
  // .then((answers: { todo: string; newDescription?: string }) => {
  //   if (answers.todo !== "Volver al menú") {
  //     inquirer
  //       .prompt([
  //         {
  //           type: "confirm",
  //           name: "confirm",
  //           message: `¿Estás seguro de que quieres modificar la tarea "${answers.todo}"?`,
  //         },
  //       ])
  //       .then((confirmAnswers: { confirm: boolean }) => {
  //         if (confirmAnswers.confirm && answers.newDescription !== undefined) {
  //           const todo = todos.find((t) => t.description === answers.todo);
  //           if (todo) {
  //             todo.description = answers.newDescription;
  //             saveTodos();
  //           }
  //         }
  //         showMenu();
  //       });
  //   } else {
  //     showMenu();
  //   }
  // });
};

const markCompleted = (): void => {
  const choices = todoManager.todos.map((todo, index) => ({
    name: `${index + 1}. ${todo.description} - ${todo.completed ? "Completada" : "Pendiente"}`,
    value: todo,
  }));

  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "selectedTodos",
        message: "Elige la tarea completada:",
        choices: [
          {
            name: "Volver al menú",
            value: null,
          },
          new inquirer.Separator(),
          ...choices,
        ],
      },
    ])
    .then((answers: { selectedTodos: Todo[] })  => {
      const selectedTodos = answers.selectedTodos.filter((todo) => todo !== null);
      if (selectedTodos.length > 0) {
        todoManager.markCompleted(selectedTodos); // Utiliza el método de todoManager
        console.log("Tareas marcadas como completadas.");
      } else {
        console.log("No se seleccionaron tareas.");
      }
      showMenu();
    });
};

const listTodos = (): void => {
  const todoList = todoManager.listTodos(); // Utiliza el método de todoManager
  console.log("\n🚀 Tu Lista de Tareas:");
  todoList.forEach((todo) => {
    console.log(todo);
  });
  console.log("");
  inquirer
    .prompt([
      {
        type: "list",
        name: "nextAction",
        message: "¿Qué te gustaría hacer?",
        choices: ["Volver al menú principal"],
      },
    ])
    .then(() => {
      showMenu(); // Llama a showMenu después de ver las tareas
    });
};

showMenu();
