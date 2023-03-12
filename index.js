let comments = [
  {
    id: 1,
    author: "Позавчерашний Автор",
    text: "Тут расположен комментарий оставленный ПО-ЗА-ВЧЕРА",
    date: new Date().setTime(new Date().getTime() - 48 * 60 * 60 * 1000),
    likesCount: false,
  },
  {
    id: 2,
    author: "Вчерашний Автор",
    text: "Вчерашний комментарий =))) ",
    date: new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000),
    likesCount: false,
  },
  {
    id: 3,
    author: "Сегодняшний Автор",
    text: "Have a nice day!",
    date: new Date().getTime(),
    likesCount: true,
  },
];

const commentsList = document.querySelector(".comments");
const form = document.querySelector(".comment-creator");
const inputNameWarning = document.querySelector(
  ".comment-creator__warning_name"
);
const inputDateWarning = document.querySelector(
  ".comment-creator__warning_date"
);
const modalBackground = document.querySelector(".modal-background");
const commentCreatorOpenButton = document.querySelector(
  ".comment-creator-opener"
);

// фукции для валидации даты
function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
function checkDate(dateStr) {
  const [day, month, year] = dateStr.split(".");
  return isValidDate(+day, +month, +year);
}

function handleChangeErrorVisibility(inputType, action) {
  let element = inputType === "name" ? inputNameWarning : inputDateWarning;
  element.classList[action]("comment-creator__warning_visible");
}

function checkEnteredValues(name, date) {
  const isNameValid = !!name.trim();
  const isDateValid = checkDate(date) || !date.trim();
  return { isNameValid, isDateValid };
}

function onSubmit(event) {
  event.preventDefault();

  const { isNameValid, isDateValid } = checkEnteredValues(
    form.name.value,
    form.date.value
  );

  if (!isNameValid) {
    handleChangeErrorVisibility("name", "add");
  }
  if (!isDateValid) {
    handleChangeErrorVisibility("date", "add");
  }
  if (!isNameValid || !isDateValid) {
    return;
  }

  let dateToPush;
  if (!form.date.value.trim()) {
    dateToPush = new Date().getTime();
  } else {
    let [enteredDay, enteredMonth, enteredYear] = form.date.value
      .split(".")
      .map((el) => parseInt(el));

    dateToPush = new Date(
      enteredYear,
      --enteredMonth,
      enteredDay,
      new Date().getHours(),
      new Date().getMinutes()
    ).getTime();
  }

  addComment({
    id: comments.length + 1,
    author: form.name.value,
    text: form.text.value,
    date: dateToPush,
    likesCount: 0,
  });

  toggleModalVisibility();
  reRenderComments();
}

function toggleModalVisibility() {
  modalBackground.classList.toggle("modal-background_visible");
  form.classList.toggle("comment-creator_visible");
}

function reRenderComments() {
  commentsList.innerHTML = "";
  comments.forEach(({ id, author, likesCount, date, text }) => {
    renderComment(id, author, text, likesCount, date);
  });
}
function deleteComment(commentId) {
  comments = comments.filter((el) => el.id != commentId);
  reRenderComments();
}
function addComment(newComment) {
  comments.push(newComment);
  reRenderComments();
}
function addLike(commentId) {
  const commentIndex = comments.findIndex((el) => el.id == commentId);
  comments[commentIndex].likesCount = !comments[commentIndex].likesCount;
  reRenderComments();
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today - 24 * 3600 * 1000);

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return `Сегодня ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
  }

  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return `Вчера ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
  }

  return `${date.toLocaleDateString(
    "ru-RU"
  )} ${date.getHours()}:${date.getMinutes()}`;
}

function renderComment(id, author, text, likesCount, date) {
  const element = document.createElement("div");
  const likes = likesCount ? 1 : "";
  const dateToRender = formatDateTime(date);
  element.classList.add("comment-item");
  element.innerHTML = `
    <div class="comment-item__title-block">
      <span class="comment-item__author">${author}</span>
      <div class="comment-item__date">${dateToRender}</div>
    </div>
    <p class="comment-item__text">${text}</p>
    <div class="action-block">
      <div class="action-block__item action-block__item_likes">
        <span class="action-block__count">${likes}</span>
        <button 
          onClick="addLike(${id})" 
          class="action-block__button ${
            likes && "action-block__button_active"
          }">
          <i class="fa-regular fa-heart fa-xl"></i>
        </button>
      </div>
      <div class="action-block__item action-block__item_delete">
        <button onClick="deleteComment(${id})" class="action-block__button action-block__button_delete">
          <i class="fa-regular fa-trash-can fa-xl"></i>
        </button>
      </div>
    </div>
  `;
  commentsList.append(element);
}

form.addEventListener("submit", onSubmit);
modalBackground.addEventListener("click", toggleModalVisibility);
commentCreatorOpenButton.addEventListener("click", toggleModalVisibility);
form.name.addEventListener("input", () =>
  handleChangeErrorVisibility("name", "remove")
);
form.date.addEventListener("input", () =>
  handleChangeErrorVisibility("date", "remove")
);

comments.forEach(({ id, author, likesCount, date, text }) => {
  renderComment(id, author, text, likesCount, date);
});
