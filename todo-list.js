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

  sortBy(selectValue) {
    this.order = selectValue;
    this.sortList();
    this.setToStorage();
    this.render();
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
    const fragment = new DocumentFragment();

    this.items.forEach(item => {
      const hr = document.createElement('hr');
      const row = document.createElement('div');
      const divDate = document.createElement('div');
      const divText = document.createElement('div');
      const h5 = document.createElement('h5');
      const divDescription = document.createElement('div');
      const divStatus = document.createElement('div');
      const statusBtn = document.createElement('button');
      const divComplete = document.createElement('div');
      const completeBtn = document.createElement('button');

      row.className = 'row';
      row.setAttribute('data-id', item.id);
      divDate.className = 'col-2';
      divText.className = 'col';
      statusBtn.className = 'status-btn btn btn-sm btn-secondary';
      divStatus.className = 'col-2';
      completeBtn.className = 'complete-btn btn btn-sm btn-primary';
      divComplete.className = 'col-3';

      divDate.append(this.formatDate(item.date));
      h5.append(item.name);
      divDescription.append(item.description);
      divText.append(h5, divDescription);
      statusBtn.append(item.status);
      divStatus.append(statusBtn);
      completeBtn.append('Complete');
      divComplete.append(completeBtn);

      row.append(divDate, divText, divStatus, divComplete);
      fragment.append(hr, row)
    });

    if (!fragment.firstChild) return;
    console.log(fragment);

    this.rootEl.innerHTML = '';
    this.rootEl.append(fragment);


    // this.items.forEach(item => {
    //   const row = `<hr/>
    //               <div data-id="${item.id}" class="row">
    //                 <div class="col-2">${this.formatDate(item.date)}</div>
    //                 <div class="col">
    //                   <h5>${item.name}</h5>
    //                   <div>${item.description}</div>
    //                 </div>
    //                 <div class="col-2">
    //                   <button class="status-btn btn btn-sm btn-secondary">${item.status}</button>
    //                 </div>
    //                 <div class="col-3">
    //                   <button class="complete-btn btn btn-sm btn-primary">Complete</button>
    //                 </div>
    //               </div>`;
    //   box.insertAdjacentHTML("beforeEnd", row);
    // });
    // if (!box.firstChild) return;
    // this.rootEl.innerHTML = "";
    // this.rootEl.insertAdjacentHTML("beforeEnd", box);
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
  const sortSelect = document.querySelector("#sort-select");

  const todoList = new TodoList(listBox, TodoListStorage.get());

  todoList.render();
  sortSelect.value = todoList.order;

  todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!this.name.value) return;
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

  sortSelect.addEventListener("change", function (e) {
    todoList.sortBy(this.value);
  });
}
