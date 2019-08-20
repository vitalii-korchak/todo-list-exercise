"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  todoInit();
}

function todoInit() {
  const listBox = document.querySelector("#list-box");
  const nameField = document.querySelector("#item-name-field");
  const descriptionField = document.querySelector("#item-description-field");
  const todoForm = document.querySelector("#todo-form");

  class TodoList {
    constructor(items = []) {
      this.items = items.map(function(item) {
        item.date = new Date(item.date);
      });
    }

    addTodo = e => {
      e.preventDefault();
      this.items.push(new ListItem(nameField.value, descriptionField.value));
      console.log(1, this.items);
      // this.render(obj);
    };

    // deleteTodo() {}

    // completeTodo: () => {}

    // render(element) {

    // }
  }

  class ListItem {
    constructor(title, description) {
      this.id =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
      this.date = new Date();
      this.title = title;
      this.description = description;
      this.status = "Active";
      this.completed = false;
    }
  }

  const todoList = new TodoList();

  todoForm.addEventListener("submit", todoList.addTodo);
  // listBox.addEventListener("click", changeStatus);
  // document.querySelector("#sort-select").addEventListener("change", sortArr);
}
