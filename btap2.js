// Mảng chứa danh sách công việc
const todos = JSON.parse(localStorage.getItem("todos")) || [];

const createFormElement = document.querySelector(".create__form");
const clearButtonElement = document.querySelector(".todo__clear__button");
const countElement = document.querySelector(".todo__count__value");
const filterForm = document.querySelector(".filter__form");
const todoListElement = document.querySelector(".todo__list");
const titleInputElement = document.querySelector(".form__control");

// Lưu lại công việc
function saveLocal() {
  localStorage.setItem("a", JSON.stringify(todos));
}

function updateTodoCount() {
  countElement.textContent = todos.filter(function (todo) {
    return !todo.status;
  }).length;
}

// Tạo obj
function createNewTodo(title) {
  return {
    id: Date.now(),
    title,
    status: false,
  };
}

// Xóa công việc
function deleteTodo(e) {
  const buttonElement = e.target;

  const liElement = buttonElement.parentElement;
  const todoId = liElement.getAttribute("todo-id");
  liElement.remove();

  const todoIndex = todos.findIndex(function (todo) {
    return todo.id == todoId;
  });

  todos.splice(todoIndex, 1);
  updateTodoCount();
  saveLocal();
}
function updateTodo(e) {
  const checkboxElement = e.target;

  const liElement = checkboxElement.parentElement;

  const todoId = liElement.getAttribute("todo-id");

  const todo = todos.find(function (todo) {
    return todo.id == todoId;
  });

  todo.status = checkboxElement.checked;
  updateTodoCount();
  saveLocal();
}

//Tạo một thẻ công việc
function createTodoItem(todo) {
  const liElement = document.createElement("li");
  liElement.classList.add("todo__item");

  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.classList.add("todo__checkbox");

  checkboxElement.addEventListener("change", updateTodo);

  // Nếu công việc đã hoàn thành thì checked
  if (todo.status) {
    checkboxElement.checked = true;
  }
  const titleElement = document.createElement("span");
  titleElement.classList.add("todo__title");
  titleElement.textContent = todo.title;

  titleElement.addEventListener("dblclick", editTodoTitle);

  const buttonElement = document.createElement("button");
  buttonElement.classList.add("todo__delete__button");
  buttonElement.textContent = "Delete";

  buttonElement.addEventListener("click", deleteTodo);

  liElement.append(checkboxElement, titleElement, buttonElement);

  liElement.setAttribute("todo-id", todo.id);
  saveLocal();
  return liElement;
}

// Render danh sách item từ mảng todos
function renderTodoList(todos) {
  todoListElement.innerHTML = "";
  todos.forEach(function (todo) {
    const item = createTodoItem(todo);

    todoListElement.append(item);
  });

  updateTodoCount();
}
createFormElement.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInputElement.value;

  const newTodo = createNewTodo(title);
  todos.push(newTodo);

  const newTodoItem = createTodoItem(newTodo);
  todoListElement.append(newTodoItem);

  updateTodoCount();
  saveLocal();
});

clearButtonElement.addEventListener("click", function () {
  todos.length = 0;
  todoListElement.innerHTML = "";
  updateTodoCount();
  saveLocal();
});
filterForm.addEventListener("change", function (e) {
  const filterValue = filterForm.elements.filter.value;
  const items = Array.from(todoListElement.children);
  items.forEach(function (item) {
    const inputElement = item.querySelector(".todo__checkbox");
    switch (filterValue) {
      case "active": {
        console.log("Active");

        if (inputElement.checked) {
          item.style.display = "none";
        } else {
          item.style.display = "block";
        }
        break;
      }
      case "completed": {
        console.log("Completed");

        if (inputElement.checked) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
        break;
      }
      default: {
        console.log("Active");
        item.style.display = "block";
      }
    }
  });
});

renderTodoList(todos);

// Chỉnh sửa tiêu đề công việc
function editTodoTitle(e) {
  const spanElement = e.target;

  // tạo 1 phần tử input
  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.classList.add("todo__title__input");

  // Đặt giá trị của phần tử đầu vào thành tiêu đề việc cần làm hiện tại
  inputElement.value = spanElement.textContent;

  // Replace the span element with the input element
  spanElement.replaceWith(inputElement);
  inputElement.focus();
  // Đặt tiêu điểm cho phần tử đầu vào và di chuyển con trỏ đến cuối văn bản

  inputElement.setSelectionRange(
    inputElement.value.length,
    inputElement.value.length
  );
  saveLocal();
  updateTodoCount();
}
