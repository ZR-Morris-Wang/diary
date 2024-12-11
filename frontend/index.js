/* global axios */
const editTemplate = document.querySelector("#edit-and-create-item-template");
const viewTemplate = document.querySelector("#view-template");
const rowTemplate = document.querySelector("#trello-container-rows");
const middleBlockTemplate = document.querySelector(
  "#trello-container-middle-template",
);
const rightBlockTemplate = document.querySelector(
  "#trello-container-right-template",
);
const overlayWindow = document.querySelector("#edit-and-create-window");
const trello_rows = document.querySelector("#trello-rows");
let page_opened_flag = false;
let edit_from_existing = false;

const dayMap = ["日", "一", "二", "三", "四", "五", "六"];
let dateString = new Date();
let year = 1900 + dateString.getYear();
let compositeTime = {
  month: dateString.getMonth() + 1,
  date: dateString.getDate(),
};
fillZero(compositeTime);
let day = dayMap[dateString.getDay()];
console.log(dayMap[2]);
function fillZero(ipt) {
  if (ipt.month < 10) {
    compositeTime.month = "0" + ipt.month;
  }
  if (ipt.date < 10) {
    compositeTime.date = "0" + ipt.date;
  }
}

let formattedDate =
  year +
  "." +
  compositeTime.month +
  "." +
  compositeTime.date +
  " (" +
  day +
  ")";

let diaryLength = 0;
let RenderingRows = 0;
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

let allDiaries = [];

async function main() {
  setupEventListeners();
  fetchDB();
}

let currentRow = 0;
let currentCol = 0;

// async function clearDB() {
//   getDiaries({}).then(resp => {
//     resp.forEach((diary => deleteDiaryById(diary.id)));
//   });
//   currentRow = 0;
//   currentCol = 0;
// }

async function fetchDB(filterValue, filterType) {
  currentRow = 0;
  currentCol = 0;
  if (arguments.length === 0) {
    try {
      await getDiaries({}).then((resp) => {
        diaryLength = resp.length;
        RenderingRows = Math.floor(diaryLength / 3) + 1;
        allDiaries = resp;
        resp.forEach((diary) => renderDiary(diary));
        if (diaryLength === 0) {
          alert("No data in database");
        }
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load todos!");
    }
  } else if (arguments.length === 2) {
    try {
      if (filterType === "mood") {
        console.log("filter tag mood");
        await getDiaries({ mood: filterValue }).then((resp) => {
          diaryLength = resp.length;
          RenderingRows = Math.floor(diaryLength / 3) + 1;
          allDiaries = resp;
          resp.forEach((diary) => renderDiary(diary));
        });
        if (diaryLength === 0) {
          alert("No data in database");
        }
      } else if (filterType === "tag") {
        console.log("filter tag tag");
        await getDiaries({ tag: filterValue }).then((resp) => {
          diaryLength = resp.length;
          RenderingRows = Math.floor(diaryLength / 3) + 1;
          allDiaries = resp;
          resp.forEach((diary) => renderDiary(diary));
        });
        if (diaryLength === 0) {
          alert("No data in database");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load todos!");
    }
  }
}

function renderDiary(diary) {
  if (currentRow < RenderingRows) {
    if (currentCol % 3 == 0) {
      const newRow = rowTemplate.content.cloneNode(true);
      trello_rows.appendChild(newRow);
      changeAttributeLeft(currentRow);
      setupTrelloEventListeners(
        document.querySelector(
          "#row" + (currentRow + 1) + "-trello-container-left",
        ),
      );
      applyData(currentRow, diary, "left");
    } else if (currentCol % 3 == 1) {
      const newMiddleBlock = middleBlockTemplate.content.cloneNode(true);
      const middleSection = document.querySelector(
        "#row" + (currentRow + 1) + "-middle-trello-section",
      );
      middleSection.appendChild(newMiddleBlock);
      changeAttributeMiddle(currentRow);
      setupTrelloEventListeners(
        document.querySelector(
          "#row" + (currentRow + 1) + "-trello-container-middle",
        ),
      );
      applyData(currentRow, diary, "middle");
    } else {
      const newRightblock = rightBlockTemplate.content.cloneNode(true);
      const rightSection = document.querySelector(
        "#row" + (currentRow + 1) + "-right-trello-section",
      );
      rightSection.appendChild(newRightblock);
      changeAttributeRight(currentRow);
      setupTrelloEventListeners(
        document.querySelector(
          "#row" + (currentRow + 1) + "-trello-container-right",
        ),
      );
      applyData(currentRow, diary, "right");
    }

    currentCol += 1;
    if (currentCol % 3 == 0) {
      currentRow += 1;
      currentCol = 0;
    }
  }
}

function changeAttributeLeft(currentRow) {
  document
    .querySelector("#trello-container-row")
    .setAttribute("id", "trello-container-row" + (currentRow + 1));
  document
    .querySelector("#row-middle-trello-section")
    .setAttribute("id", "row" + (currentRow + 1) + "-middle-trello-section");
  document.querySelector("#trello-container-row" + (currentRow + 1)).style.top =
    140 * currentRow + "px";
  const parent = document.querySelector("#row-trello-container-left");
  parent.setAttribute(
    "id",
    "row" + (currentRow + 1) + "-trello-container-left",
  );
  parent.dataset.row = currentRow;
}

function changeAttributeMiddle(currentRow) {
  const parent = document.querySelector("#row-trello-container-middle");
  parent.setAttribute(
    "id",
    "row" + (currentRow + 1) + "-trello-container-middle",
  );
  parent.dataset.row = currentRow;
  document
    .querySelector("#row-right-trello-section")
    .setAttribute("id", "row" + (currentRow + 1) + "-right-trello-section");
}

function changeAttributeRight(currentRow) {
  const parent = document.querySelector("#row-trello-container-right");
  parent.setAttribute(
    "id",
    "row" + (currentRow + 1) + "-trello-container-right",
  );
  parent.dataset.row = currentRow;
}

function applyData(currentRow, diary, position) {
  let parentContainer = document.querySelector(
    "#trello-container-row" + (currentRow + 1),
  );
  let positionContainer = parentContainer.querySelector(
    "#row" + (currentRow + 1) + "-trello-container-" + position,
  );
  positionContainer.querySelector(".diary-date-innerHTML").innerHTML =
    diary.date;
  positionContainer.querySelector(".diary-tag-innerHTML").innerHTML = diary.tag;
  positionContainer.querySelector(".diary-mood-innerHTML").innerHTML =
    diary.mood;
}

function setupEventListeners() {
  const filter1 = Array.prototype.slice.call(
    document.querySelectorAll(".tag-filter-container"),
  );
  const filter2 = Array.prototype.slice.call(
    document.querySelectorAll(".mood-filter-container"),
  );
  const filter3 = document.querySelector(".all-filter-container");
  filter1.forEach(
    parentFunction,
  ); /* filter1.forEach is unable to pass array elements as html elements to parentFunction causing an error */
  filter2.forEach(parentFunction);

  filter3.addEventListener("click", async () => {
    document.querySelector("#trello-rows").innerHTML = "";
    fetchDB();
  });

  const newDiaryButton = document.querySelector("#create-new-diary-btn");
  newDiaryButton.addEventListener("click", async () => {
    if (!page_opened_flag) {
      generateEditWindow(edit_from_existing);
    }
  });
}

function parentFunction(filterContainer) {
  console.log(filterContainer);
  const filterValue = filterContainer.querySelector("p").innerHTML;
  const filterType = filterContainer.className.substring(
    0,
    filterContainer.className.indexOf("-"),
  );
  setupFilterEventListeners(filterContainer, filterValue, filterType);
}
function setupFilterEventListeners(filterContainer, filterValue, filterType) {
  filterContainer.addEventListener("click", () => {
    console.log("clicked");
    document.querySelector("#trello-rows").innerHTML = "";
    fetchDB(filterValue, filterType);
  });
}

function setupTrelloEventListeners(container) {
  container.addEventListener("click", async () => {
    if (!page_opened_flag) {
      const row = container.dataset.row;
      const col = container.dataset.column;
      generateViewWindow(row, col);
    }
  });
}

function generateViewWindow(row, col) {
  const viewWindow = viewTemplate.content.cloneNode(true);
  renderWindow(viewWindow);
  const index = 3 * parseInt(row) + parseInt(col);
  applyViewData(allDiaries[index]);
  page_opened_flag = true;

  const editButton = document.querySelector(".edit-button");
  editButton.addEventListener("click", () => {
    closeWindow();
    edit_from_existing = true;
    generateEditWindow(edit_from_existing, allDiaries[index]);
  });
}

function applyViewData(diary) {
  const viewWindowContainer = document.querySelector(".background");
  viewWindowContainer.querySelector("#view-data-date").innerHTML = diary.date;
  viewWindowContainer.querySelector(".diary-tag-view").innerHTML = diary.tag;
  viewWindowContainer.querySelector(".diary-mood-view").innerHTML = diary.mood;
  viewWindowContainer.querySelector(".view-diary-content").value =
    diary.content;
}

function generateEditWindow(edit_from_existing, _diary) {
  const editWindow = editTemplate.content.cloneNode(true);
  renderWindow(editWindow);
  const dateContainer = document.querySelector("#data-date");
  if (edit_from_existing) {
    editWindowSetup(_diary);
    dateContainer.innerHTML = _diary.date;
  } else {
    createWindowSetup();
    dateContainer.innerHTML = formattedDate;
  }
  page_opened_flag = true;
}

function createWindowSetup() {
  const viewCloseSign = document.querySelector(".view-close-sign");
  viewCloseSign.addEventListener("click", closeWindow);

  const saveDiaryEdit = document.querySelector(".save-diary-edit");
  const dateContainer = document.querySelector("#data-date");
  const textArea = document.querySelector(".edit-diary-content");

  dateContainer.addEventListener("focus", () => {
    dateContainer.removeAttribute("readonly");
    dateContainer.value = formattedDate.substring(0, 10);
  });

  dateContainer.addEventListener("blur", () => {
    validDate(dateContainer.value);
    dateContainer.setAttribute("readonly", true);
    console.log(formattedDate);
    dateContainer.value = formattedDate;
    console.log(formattedDate);
    console.log(validDate(dateContainer.value.substring(0, 10)));
    if (validDate(dateContainer.value.substring(0, 10))) {
      dateContainer.style.background = "antiquewhite";
    } else {
      console.log(validDate(dateContainer.value.substring(0, 10)));
      dateContainer.style.background = "red";
    }
  });

  saveDiaryEdit.addEventListener("click", async () => {
    if (!validDate(dateContainer.value.substring(0, 10))) {
      alert("Date is invalid");
      closeWindow();
    }

    if (!textArea.value) {
      alert("Content is required");
      closeWindow();
    } else {
      const diaryContent = textArea.value;
      const tag = document.querySelector("#edit-and-create-diary-tag").value;
      const mood = document.querySelector("#edit-and-create-diary-mood").value;
      const creatingDiary = createDiary({
        date: formattedDate,
        content: diaryContent,
        tag: tag,
        mood: mood,
      });
      closeWindow();
      await creatingDiary;
      document.querySelector("#trello-rows").innerHTML = "";
      fetchDB();
    }
  });

  const cancelDiaryEdit = document.querySelector(".cancel-diary-edit");
  cancelDiaryEdit.addEventListener("click", closeWindow);
}

function editWindowSetup(_diary) {
  const viewCloseSign = document.querySelector(".view-close-sign");
  viewCloseSign.addEventListener("click", closeWindow);

  const saveDiaryEdit = document.querySelector(".save-diary-edit");
  const textArea = document.querySelector(".edit-diary-content");
  let tag = document.querySelector("#edit-and-create-diary-tag").value;
  let mood = document.querySelector("#edit-and-create-diary-mood").value;
  textArea.value = _diary.content;

  saveDiaryEdit.addEventListener("click", async () => {
    if (!textArea.value) {
      alert("Content is required");
      closeWindow();
    } else {
      const diaryContent = textArea.value;
      tag = document.querySelector("#edit-and-create-diary-tag").value;
      mood = document.querySelector("#edit-and-create-diary-mood").value;
      const updateExistingDiary = updateDiary(_diary.id, {
        date: formattedDate,
        content: diaryContent,
        tag: tag,
        mood: mood,
      });
      closeWindow();
      await updateExistingDiary;
      document.querySelector("#trello-rows").innerHTML = "";
      fetchDB();
    }
  });

  const cancelDiaryEdit = document.querySelector(".cancel-diary-edit");
  cancelDiaryEdit.addEventListener("click", closeWindow);
}

function validDate(dateString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(5, 7);
  const date = dateString.substring(8);
  const oddMonth = ["01", "03", "05", "07", "08", "10", "12"];
  const evenMonth = ["04", "06", "09", "11"]; // we'll handle Febrauary seperately

  if (validateDateFormat(dateString)) {
    if (month !== "02") {
      if (oddMonth.includes(month)) {
        if (parseInt(date) <= 31 && parseInt(date) > 0) {
          updateValidDate(dateString);
          return true;
        } else {
          updateInvalidDate(dateString);
          return false;
        }
      } else if (evenMonth.includes(month)) {
        if (parseInt(date) <= 30 && parseInt(date) > 0) {
          updateValidDate(dateString);
          return true;
        } else {
          updateInvalidDate(dateString);
          return false;
        }
      } else {
        updateInvalidDate(dateString);
        return false;
      }
    } else if (month === "02") {
      if (parseInt(year) % 4 === 0) {
        if (parseInt(date) <= 29 && parseInt(date) > 0) {
          updateValidDate(dateString);
          return true;
        } else {
          updateInvalidDate(dateString);
          return false;
        }
      } else {
        if (parseInt(date) <= 28 && parseInt(date) > 0) {
          updateValidDate(dateString);
          return true;
        } else {
          updateInvalidDate(dateString);
          return false;
        }
      }
    } else {
      updateInvalidDate(dateString);
      return false;
    }
  } else {
    updateInvalidDate(dateString);
    return false;
  }
}

function validateDateFormat(dateString) {
  let validlength = dateString.length === 10;
  let yearisnum = /^\d+$/.test(dateString.substring(0, 4));
  let monthisnum = /^\d+$/.test(dateString.substring(5, 7));
  let dateisnum = /^\d+$/.test(dateString.substring(8));
  let decimalpoint =
    dateString.charAt(4) === "." && dateString.charAt(7) === ".";
  return validlength && yearisnum && monthisnum && dateisnum && decimalpoint;
}

function updateValidDate(dateString) {
  const inputDate = new Date(dateString);
  day = dayMap[inputDate.getDay()];
  formattedDate = dateString + " (" + day + ")";
  console.log(formattedDate);
}

function updateInvalidDate(dateString) {
  formattedDate = dateString;
}

function resetDate() {
  dateString = new Date();
  year = 1900 + dateString.getYear();
  compositeTime = {
    month: dateString.getMonth() + 1,
    date: dateString.getDate(),
  };
  fillZero(compositeTime);
  day = dayMap[dateString.getDay()];

  formattedDate =
    year +
    "." +
    compositeTime.month +
    "." +
    compositeTime.date +
    " (" +
    day +
    ")";
}

const closeWindow = async () => {
  overlayWindow.innerHTML = "";
  page_opened_flag = false;
  edit_from_existing = false;
  resetDate();
};

// async function deleteDiaryelement(id) {
//   try {
//     await deleteDiaryById(id);
//   } catch (error) {
//     alert("Failed to delete todo!");
//   } finally {
//     const diary = document.getElementById(id);
//     diary.remove();
//   }
// }

function renderWindow(window) {
  overlayWindow.appendChild(window);
  const viewCloseSign = document.querySelector(".view-close-sign");
  viewCloseSign.addEventListener("click", closeWindow);
}

async function getDiaries(req) {
  console.log(req);
  const response = await instance.get("/diaries", { params: { req } });
  return response.data;
}

async function createDiary(diary) {
  console.log(diary);
  const response = await instance.post("/diaries", diary);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateDiary(id, diary) {
  const response = await instance.put(`/diaries/${id}`, diary);
  return response.data;
}

// async function deleteDiaryById(id) {
//   const response = await instance.delete(`/diaries/${id}`);
//   return response.data;
// }

main();
