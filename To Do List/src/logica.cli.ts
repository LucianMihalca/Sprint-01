
export default class ToDo {
  todos: { description: string; completed: boolean }[] = [];
  constructor() {}

  addTodo(description: string): void {
    this.todos.push({ description, completed: false });
  }

  removeTodo(description: string): void {
    this.todos = this.todos.filter((todo) => todo.description !== description);
  }

  modifyTodo(oldDescription: string, newDescription: string): void {
    const todo = this.todos.find((t) => t.description === oldDescription);
    if (todo) {
      todo.description = newDescription;
    }
  }


  markCompleted(selectedTodos: { description: string; completed: boolean }[]): void {
    selectedTodos.forEach((selectedTodo) => {
      const todo = this.todos.find((t) => t.description === selectedTodo.description);
      if (todo) {
        todo.completed = true;
      }
    });
  }


  listTodos(): string[] {
    return this.todos.map((todo, index) => {
      const status = todo.completed ? "Completada" : "Pendiente";
      return `${index + 1}. ${todo.description} - ${status}`;
    });
  }
}
