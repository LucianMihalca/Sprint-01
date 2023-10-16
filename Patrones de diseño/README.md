
# Patrón de Diseño Modelo-Vista-Controlador (MVC)

El patrón de diseño Modelo-Vista-Controlador (MVC) es un patrón arquitectónico que separa una aplicación en tres componentes principales: Modelo, Vista, y Controlador.

---

## 📚 Índice

- [1. Modelo](#1-modelo)
- [2. Vista](#2-vista)
- [3. Controlador](#3-controlador)
- [Conclusión](#conclusión)

---

## 📦 1. Modelo - `TaskModel`
El modelo `TaskModel` tiene una lista de tareas 📋 y dos métodos principales:

```javascript
class TaskModel {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }
}
```
###  Métodos 

💡 `addTask(task)`
Este método toma una tarea como argumento y la agrega a la lista de tareas.

💡 `getTasks()`
Este método devuelve la lista actual de tareas.
Este modelo actúa como la "fuente única de verdad"  para el estado de nuestras tareas en la aplicación.

---

## 🖥 2. Vista - `TaskView`
La clase `TaskView`  es responsable de interactuar con la interfaz de usuario.
Contiene varios elementos DOM y métodos.

```javascript
class TaskView {
  constructor() {
    this.taskInput = document.getElementById("taskInput");
    this.addBtn = document.getElementById("addBtn");
    this.taskList = document.getElementById("taskList");
  }

  getTaskInput() {
    return this.taskInput.value;
  }

  resetTaskInput() {
    this.taskInput.value = "";
  }

  renderTasks(tasks) {
    this.taskList.innerHTML = "";
    tasks.forEach((task) => {
      this.taskList.innerHTML += `<li>${task}</li>`;
    });
  }
}
``` 
### Métodos 

💡 getTaskInput()
Devuelve el valor del campo de entrada donde el usuario escribe una nueva tarea.

💡 resetTaskInput()
Borra el campo de entrada después de que se ha añadido una tarea.

💡 renderTasks(tasks)
Toma una lista de tareas y actualiza la interfaz de usuario para mostrarlas.   

---

## 🎮 3. Controlador - `TaskController`

La clase `TaskController` funciona como intermediario entre el modelo y la vista. 
Contiene la lógica del negocio.

```javascript
class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.view.addBtn.addEventListener("click", this.addTask.bind(this));
  }

  addTask() {
    const task = this.view.getTaskInput();
    if (task) {
      this.model.addTask(task);
      this.view.renderTasks(this.model.getTasks());
      this.view.resetTaskInput();
    }
  }
}
```
### Métodos 

💡 init()
Este método inicializa el controlador, añadiendo un "listener" al botón  para capturar clics y agregar tareas.

💡 addTask()
Este método obtiene la tarea del campo de entrada, la agrega al modelo y actualiza la vista.

---


## 🚀 Conclusión

El patrón MVC  ayuda a separar las responsabilidades en una aplicación:

- 📦 **El modelo**: Gestiona los datos y la lógica de negocio.
- 🖥 **La vista**: Maneja la presentación y la interfaz de usuario.
- 🎮 **El controlador**: Coordina el modelo y la vista, actuando como intermediario en su comunicación.

Este tipo de separación hace que el código sea más modular, fácil de gestionar y escalar.
Cada componente se puede desarrollar, probar y mantener de manera independiente, lo que resulta especialmente útil en aplicaciones más grandes y complejas. 
