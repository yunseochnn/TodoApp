const createBtn = document.getElementById("create-btn");
const list = document.getElementById("list");

let todos = []; //재할당 가능하도록 let사용

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  //새로운 아이텝 객체 생성
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };
  //배열 처음에 새로운 아이템 추가
  todos.unshift(item);
  //요소생성
  const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);
  //리스트 요소 안에 방금 생성한 아이템 요소 추가
  list.prepend(itemEl);
  //disabled속성 제거
  inputEl.removeAttribute("disabled");
  //추가버튼 눌렀을 때 focus 바로 가도록
  inputEl.focus();

  saveToLocalStorage();
}
//요소 생성 함수
function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item"); //item이라는 이름으로 클래스 만들기

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.setAttribute("disabled", "");

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circle";

  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;
    if (item.complete) {
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }
    saveToLocalStorage();
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    //위에 input에 안넣는 이유는 input에 하면 입력할 때마다 저장
    saveToLocalStorage();
  });
  //edit버튼 눌러야 수정 가능
  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    //focus주기
    inputEl.focus();
  });

  removeBtnEl.addEventListener("click", () => {
    //데이터 변경
    todos = todos.filter((t) => t.id != item.id); //item.id와 다른것만 새로운 배열에..
    //요소 삭제
    itemEl.remove();
    saveToLocalStorage();
  });

  //요소에 요소 넣기
  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);

  return {
    itemEl: itemEl,
    inputEl: inputEl,
    editBtnEl: editBtnEl,
    removeBtnEl: removeBtnEl,
  };
}

//local storage를 위한 함수
function saveToLocalStorage() {
  //value에 string값만 받기 때문에 string화 해줌
  const data = JSON.stringify(todos);
  localStorage.setItem("my_todos", data);
}

//데이터 저장한 거 가져오는 함수
function loadFromLocalStorage() {
  const data = localStorage.getItem("my_todos");

  //원래 타입으로 변환
  if (data) {
    todos = JSON.parse(data);
  }
}

//화면에 나오도록
function displayTodos() {
  loadFromLocalStorage();
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  }
}

//refresh될 때 바로 호출되도록
displayTodos();
