"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const listBox = document.querySelector("#list-box");
  let listItemArr = JSON.parse(localStorage.getItem("storageArr")) || [];
  let nameField = document.querySelector("#item-name-field");
  let descriptionField = document.querySelector("#item-description-field");
  let addBtn = document.querySelector("#add-item-btn");

  addBtn.addEventListener("click", addItem);
  listBox.addEventListener("click", changeStatus);

  class ListItem {
    constructor(title, description, status = "Active") {
      this.id = "_" + Math.random().toString(36).substr(2, 9);
      this.date = new Date();
      this.title = title;
      this.description = description;
      this.status = status;
    }
  }

  class Ui {
    formatDate(date) {
      date = new Date(date);
      let dd = date.getDate();
      if (dd < 10) dd = "0" + dd;

      let mm = date.getMonth() + 1;
      if (mm < 10) mm = "0" + mm;

      let yy = date.getFullYear();

      return `${dd}.${mm}.${yy}`;
    }

    clearValue(field1, field2) {
      field1.value = "";
      field2.value = "";
    }

    createItem(obj) {
      const row = `<hr/>
                    <div data-id="${obj.id}" class="row">
                      <div class="col-3">${this.formatDate(obj.date)}</div>
                      <div class="col-6">
                        <h5>${obj.title}</h5>
                        <div>${obj.description}</div>
                      </div>
                      <div class="col-3">
                        <button class="status-btn btn btn-sm btn-secondary">${obj.status}</button>
                      </div>
                    </div>`;
      listBox.insertAdjacentHTML("beforeEnd", row);
    }
  }

  render();

  function addItem() {
    let nameValue = nameField.value;
    if (!nameValue) return;

    let itemObj = new ListItem(nameValue, descriptionField.value);

    let ui = new Ui();
    ui.createItem(itemObj);
    ui.clearValue(nameField, descriptionField);

    listItemArr.push(itemObj);

    saveToStorage();
  }

  function changeStatus(e) {
    let statusBtn = e.target.closest(".status-btn");
    if (!statusBtn) return;

    statusBtn.classList.toggle("btn-secondary");
    statusBtn.classList.toggle("btn-success");

    statusBtn.textContent = statusBtn.textContent.toLowerCase() == "active" ? "Completed" : "Active";

    let obj = listItemArr.find(item => item.id == statusBtn.closest("[data-id]").getAttribute("data-id"));
    // console.log(listItemArr); why status prop the same?
    obj.status = obj.status.toLowerCase() == "active" ? "Completed" : "Active";
    // console.log(listItemArr); why status prop the same?
    saveToStorage();
  }

  document.querySelector("#sort-select").addEventListener("change", sortArr);

  function sortArr() {
    let optionValue = this.options[this.selectedIndex].value;

    if (optionValue == "date") {
      listItemArr.sort(function (a, b) {
        return a.date - b.date;
      });
    }

    if (optionValue == "alphabetical") {
      listItemArr.sort(function (a, b) {
        return a.title - b.title;
      });
    }
    render();
    saveToStorage();
  }

  function render() {
    let ui = new Ui();
    listBox.innerHTML = "";

    for (let i = 0; i < listItemArr.length; i++) {
      ui.createItem(listItemArr[i]);
    }
  }

  function saveToStorage() {
    localStorage.setItem("storageArr", JSON.stringify(listItemArr));
  }
}
