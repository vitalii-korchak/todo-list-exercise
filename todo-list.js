"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  todoInit();
}

class TodoListStorage {
  static get() {
    return JSON.parse(localStorage.getItem("todoList")) || {};
  }

  static set(todoList) {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }
}

class TodoList {
  constructor(rootEl, { order = "date", items = [] }) {
    this.rootEl = rootEl;
    this.order = order;
    this.items = items.map(item => new ListItem(item));
  }

  addTodo(name, description) {
    if (!name) return;
    this.items.push(new ListItem({ name, description }));
    this.setToStorage();
    this.render();
  }

  deleteTodo(id) {
    this.items.splice(this.items.findIndex(item => item.id == id), 1);
    this.setToStorage();
    this.render();
  }

  completeTodo(id) {
    this.items.find(item => item.id == id).complete();
    this.setToStorage();
    this.render();
  }

  sortList() {
    if (this.order == "date") {
      this.items.sort((a, b) => a.date - b.date);
    }

    if (this.order == "alphabetical") {
      this.items.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
      });
    }
  }

  setSelectValue(selectValue) {
    this.order = selectValue;
    this.sortList();
    this.setToStorage();
    this.render();
  }

  getSelectValue(elem) {
    elem.value = this.order;
  }

  formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = "0" + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;

    let yy = date.getFullYear();

    return `${dd}.${mm}.${yy}`;
  }

  render() {
    this.rootEl.innerHTML = "";
    this.items.forEach(item => {
      const row = `<hr/>
                  <div data-id="${item.id}" class="row">
                    <div class="col-2">${this.formatDate(item.date)}</div>
                    <div class="col">
                      <h5>${item.name}</h5>
                      <div>${item.description}</div>
                    </div>
                    <div class="col-2">
                      <button class="status-btn btn btn-sm btn-secondary">${
        item.status
        }</button>
                    </div>
                    <div class="col-3">
                      <button class="complete-btn btn btn-sm btn-primary">Complete</button>
                    </div>
                  </div>`;
      this.rootEl.insertAdjacentHTML("beforeEnd", row);
    });
  }

  setToStorage = () => {
    TodoListStorage.set({
      order: this.order,
      items: this.items
    });
  };
}

class ListItem {
  constructor({ id, name, description, date }) {
    this.id =
      id ||
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
    this.date = date ? new Date(date) : new Date();
    this.name = name;
    this.description = description;
    this.status = "Active";
    this.completed = false;
  }

  complete() {
    this.status = "Complete";
  }
}

function todoInit() {
  const listBox = document.querySelector("#list-box");
  const todoForm = document.querySelector("#todo-form");
  const inputSelect = document.querySelector("#sort-select");

  const todoList = new TodoList(listBox, TodoListStorage.get());

  todoList.render();
  todoList.getSelectValue(inputSelect);

  todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    todoList.addTodo(this.name.value, this.description.value);
    this.reset();
  });

  listBox.addEventListener("click", function (e) {
    const completeBtn = e.target.closest(".complete-btn");
    const statusBtn = e.target.closest(".status-btn");

    if (completeBtn) {
      todoList.deleteTodo(
        completeBtn.closest("[data-id]").getAttribute("data-id")
      );
    }

    if (statusBtn) {
      todoList.completeTodo(
        statusBtn.closest("[data-id]").getAttribute("data-id")
      );
    }
  });

  inputSelect.addEventListener("change", function (e) {
    todoList.setSelectValue(this.value);
  });
}
