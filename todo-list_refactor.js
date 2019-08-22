"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  todoInit();
}

function getTodoList() {
  return localStorage.getItem("todoList") || {};
}

function setTodoList(todoList) {
  return localStorage.setItem("todoList", todoList);
}

function todoInit() {
  const listBox = document.querySelector("#list-box");
  const nameField = document.querySelector("#item-name-field");
  const descriptionField = document.querySelector("#item-description-field");
  const todoForm = document.querySelector("#todo-form");
  const inputSelect = document.querySelector("#sort-select");

  class TodoList {
    constructor({ order = "default", items = [] }) {
      // реализовать как с селектом?
      this.order = order;
      this.items = items.map(function(item) {
        item.date = new Date(item.date);
      });
    }

    addTodo() {
      let nameValue = nameField.value;
      if (!nameValue) return;
      this.items.push(new ListItem(nameValue, descriptionField.value));
      this.setToStorage();
      this.render();
    }

    deleteTodo(id) {
      this.items.splice(this.items.findIndex(item => item.id == id), 1);
      this.setToStorage();
      this.render();
    }

    completeTodo(id) {
      let item = this.items.find(item => item.id == id);
      item.status = item.status == "Active" ? "Completed" : "Active";
      this.setToStorage();
      this.render();
    }

    sortList(selectValue) {
      if (selectValue == "date") {
        this.items.sort(function(a, b) {
          return a.date - b.date;
        });
      }

      if (selectValue == "alphabetical") {
        this.items.sort(function(a, b) {
          return a.title - b.title;
        });
      }

      this.setToStorage();
      this.render();
    }

    setSelectValue(selectValue) {
      this.order = selectValue;
      // this.setToStorage();
    }

    getSelectValue(elem) {
      // реализация?
      if (localStorage.selectValue) {
        elem.value = localStorage.getItem("selectValue");
      }
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
      listBox.innerHTML = "";
      this.items.forEach(item => {
        const row = `<hr/>
                    <div data-id="${item.id}" class="row">
                      <div class="col-2">${this.formatDate(item.date)}</div>
                      <div class="col">
                        <h5>${item.title}</h5>
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
        listBox.insertAdjacentHTML("beforeEnd", row);
      });
    }

    setToStorage = () => {
      setTodoList({
        order: this.order,
        items: this.items
      });
    };
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

  todoList.getSelectValue(inputSelect); //????????????????

  todoForm.addEventListener("submit", function(e) {
    e.preventDefault();
    todoList.addTodo();
    this.reset();
  });

  listBox.addEventListener("click", function(e) {
    let completeBtn = e.target.closest(".complete-btn");
    let statusBtn = e.target.closest(".status-btn");
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

  inputSelect.addEventListener("change", function(e) {
    // todoList.sortList(this.value);
    todoList.setSelectValue(this.value); // вызывать тут или в sortList?
  });
}
