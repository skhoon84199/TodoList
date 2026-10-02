// localStorage에 저장된 Todo 데이터를 불러옴
let todos = [];
let nextId = 1;

const savedTodos = localStorage.getItem("todos");

if (savedTodos !== null) {
  todos = JSON.parse(savedTodos);

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id >= nextId) {
      nextId = todos[i].id + 1;
    }
  }
}

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyMessage = document.querySelector("#empty-message");

// Todo 데이터를 localStorage에 저장하는 함수
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 할 일 목록을 화면에 보여주는 함수
function renderTodos() {
  todoList.innerHTML = "";
  todoCount.textContent = "전체 할 일: " + todos.length + "개";

  if (todos.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

    const listItem = document.createElement("li");
    const text = document.createElement("span");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    listItem.className = "flex items-center gap-2 border border-gray-300 p-3";
    text.className = "min-w-0 flex-1 break-all";
    editButton.className = "bg-yellow-200 px-3 py-1 text-sm hover:bg-yellow-300";
    deleteButton.className = "bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600";

    text.textContent = todo.text;
    editButton.textContent = "수정";
    deleteButton.textContent = "삭제";

    editButton.addEventListener("click", function () {
      editTodo(todo.id, listItem);
    });

    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    listItem.appendChild(text);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  }
}

// 할 일을 추가하는 함수
function addTodo(todoText) {
  const newTodo = {
    id: nextId,
    text: todoText,
  };

  todos.push(newTodo);
  nextId = nextId + 1;
  saveTodos();
  renderTodos();
}

// 할 일을 수정하는 함수
function editTodo(id, listItem) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      const editForm = document.createElement("form");
      const editInput = document.createElement("input");
      const saveButton = document.createElement("button");
      const cancelButton = document.createElement("button");

      editForm.className = "flex w-full gap-2";
      editInput.className = "min-w-0 flex-1 border border-gray-400 px-2 py-1";
      editInput.type = "text";
      editInput.value = todos[i].text;
      editInput.maxLength = 50;
      saveButton.type = "submit";
      saveButton.textContent = "저장";
      saveButton.className = "bg-blue-500 px-3 py-1 text-white hover:bg-blue-600";
      cancelButton.type = "button";
      cancelButton.textContent = "취소";
      cancelButton.className = "bg-gray-200 px-3 py-1 hover:bg-gray-300";

      editForm.appendChild(editInput);
      editForm.appendChild(saveButton);
      editForm.appendChild(cancelButton);

      listItem.innerHTML = "";
      listItem.appendChild(editForm);

      editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const changedText = editInput.value.trim();

        if (changedText === "") {
          alert("할 일을 입력해 주세요.");
          editInput.focus();
          return;
        }

        todos[i].text = changedText;
        saveTodos();
        renderTodos();
      });

      cancelButton.addEventListener("click", function () {
        renderTodos();
      });

      editInput.focus();
      editInput.select();
      return;
    }
  }
}

// 할 일을 삭제하는 함수
function deleteTodo(id) {
  const answer = confirm("이 할 일을 삭제하시겠습니까?");

  if (answer === false) {
    return;
  }

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos.splice(i, 1);
      saveTodos();
      renderTodos();
      return;
    }
  }
}

// 추가 버튼을 눌렀을 때 실행
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputText = todoInput.value.trim();

  if (inputText === "") {
    alert("할 일을 입력해 주세요.");
    todoInput.focus();
    return;
  }

  addTodo(inputText);
  todoInput.value = "";
  todoInput.focus();
});

renderTodos();
