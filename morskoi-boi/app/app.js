import {questions} from "./data.js";

let player = 0;
let gameState = "selecting";
let gameData = [[], []];
let counter_1 = 0;
let counter_2 = 0;
let firstTeam = "";
let secondTeam = "";
let shipLimit = 20; // Ограничение на количество кораблей для каждого поля
let shipCounters = [0, 0]; // Счетчики для каждого поля (по одному для каждой команды)
let hit = false;

// В целом
// сделать drag n drop

function createBattlefield() {
  const table = document.createElement("table");
  table.classList.add("battlefield");
  table.id = player; // Устанавливаем id текущего поля (для каждой команды)
  player++;

  let headerRow = table.insertRow();
  for (let i = 0; i <= 10; i++) {
    const th = document.createElement("th");
    th.textContent = i;
    headerRow.appendChild(th);
  }

  for (let i = 0; i < 10; i++) {
    const row = table.insertRow();
    const rowHeader = document.createElement("th");
    rowHeader.textContent = String.fromCharCode(65 + i);
    row.appendChild(rowHeader);

    for (let j = 0; j < 10; j++) {
      const cell = row.insertCell();
      cell.dataset.row = i;
      cell.dataset.col = j;

      cell.addEventListener("click", function () {
        handleCellClick(cell, row, table);
      });
    }
  }
  document.querySelector("#main").appendChild(table);
}

function createBattlefields() {
  if (firstTeam === "" || secondTeam === "") {
    alert("Введите название обоих команд");
    return;
  }
  closeModal();
  console.log(firstTeam);
  console.log(secondTeam);
  createBattlefield();
  createBattlefield();
  document.querySelector(".createBattlefield").style.display = "none";
  document.querySelector(".law-text").style.display = "flex";
  document.querySelector(".startGame").classList.remove("hidden");
}

function exportSelected() {
  let result = [];
  const rows = document.querySelectorAll(".battlefield tr");

  rows.forEach(function (row) {
    let rowResult = [];
    const cells = row.querySelectorAll("td");

    cells.forEach(function (cell) {
      let res = cell.classList.contains("selected") ? 1 : 0;
      rowResult.push(res);
    });

    if (rowResult.length > 0) result.push(rowResult);
  });

  // Assuming only the first two tables are used for two teams
  gameData[0] = result.slice(0, 10); // First team's battlefield data
  gameData[1] = result.slice(10); // Second team's battlefield data
  alert("Успешно сохранено!");

  const selectedCells = document.querySelectorAll(".battlefield td.selected");
  selectedCells.forEach(function (cell) {
    cell.classList.remove("selected");
  });
}

function startGame() {
  let sum = 0;
  shipCounters.forEach((num) => {
    sum += num;
  });
  // if (sum < 40) {
  //   alert("Поставьте все корабли на поле");
  //   return;
  // }
  gameState = "playing";
  player = 0;
  exportSelected();
  document.querySelector(".law-text").style.display = "none";
  document.querySelector(".createBattlefield").style.display = "none";
  document.querySelector(".counter-container").classList.remove("hidden");
  document.querySelector(".counter-container").classList.remove("hidden");
  toggleUntouchable();
}

function handleCellClick(cell, row, table) {
  let currentPlayer = parseInt(table.id); // Получаем id текущего поля, преобразуем в число
  let selectedCells = table.querySelectorAll("td.selected").length; // Получаем количество выбранных клеток для текущей таблицы

  // Если в режиме выбора кораблей
  if (gameState === "selecting") {
    // Если клетка не выбрана и на поле ещё не размещено 20 кораблей
    if (!cell.classList.contains("selected") && selectedCells < shipLimit) {
      cell.classList.add("selected"); // Добавляем класс "selected" для выбора клетки
      shipCounters[currentPlayer] =
        table.querySelectorAll("td.selected").length; // Обновляем счетчик выбранных клеток
    }
    // Если клетка уже выбрана, убираем её (повторный клик)
    else if (cell.classList.contains("selected")) {
      cell.classList.remove("selected"); // Убираем класс "selected", снимаем корабль с клетки
      shipCounters[currentPlayer] =
        table.querySelectorAll("td.selected").length; // Обновляем счетчик выбранных клеток
    } else if (selectedCells >= shipLimit) {
      alert(
        "Максимальное количество кораблей (20) уже размещено на этом поле!"
      );
    }
  }
  // Если в игре
  else if (gameState === "playing") {
    let index = Array.from(row.parentNode.children).indexOf(row) - 1;
    let subIndex = Array.from(row.children).indexOf(cell) - 1;
    if (
      table.querySelectorAll("td.shot") + table.querySelectorAll("td.hit") ===
      20
    ) {
      winner();
    } else {
      if (gameData[currentPlayer][index][subIndex] === 1) {
        hit = false;
        showQuestion();
        console.log(hit);
        if (hit === true) {
          updateCounter();
          cell.classList.add("hit");
        } else {
          cell.classList.add("shot");
        }
      } else {
        cell.classList.add("miss");
        player = player === 1 ? 0 : 1;
        toggleUntouchable();
      }
    }
  }
}

function showQuestion() {
  let random  = Math.floor(Math.random() * questions.length - 1);
  const question = questions[random]
  document.querySelectorAll(".modalBackground")[2].style.display = "flex";
  document.querySelector(".question").innerHTML = question.title;
  document.querySelector(".answer").innerHTML = question.answer;
  delete questions[random];
}

function updateCounter() {
  if (player === 1) {
    counter_2++;
    document.querySelector("#counter-2").innerHTML = counter_2;
  } else {
    counter_1++;
    document.querySelector("#counter-1").innerHTML = counter_1;
  }
}

// Toggle untouchable state based on the current player
function toggleUntouchable() {
  // Находим все таблицы с классом battlefield
  document.querySelectorAll(".battlefield").forEach((table) => {
    table.querySelectorAll("td").forEach((cell) => {
      // Если это поле текущего игрока, добавляем класс untouchable
      if (Number(table.id) === player) {
        cell.classList.add("untouchable");
      } else {
        cell.classList.remove("untouchable");
      }
    });
  });
}

function winner() {
  document.querySelectorAll(".modalBackground")[1].style.display = "flex";
  if (counter_1 > counter_2) {
    document.querySelector(".winner").innerHTML = firstTeam;
  } else {
    document.querySelector(".winner").innerHTML = firstTeam;
  }
}

function closeModal() {
  if (document.querySelectorAll("table").length != 2) {
    document.querySelector(".createBattlefield").style.display = "flex";
  }
  document.querySelectorAll(".modalBackground").forEach((modal) => {
    modal.style.display = "none";
  });
  document.querySelector(".modal-button-container *").style.display = "none";
  document.querySelector(".answer").style.display = "none";
  document.querySelector(".hidden-text").style.display = "none";
}

function openModal() {
  document.querySelector(".createBattlefield").style.display = "none";
  document.querySelector(".modalBackground").style.display = "flex";
  document.querySelector(".modalActive").style.display = "grid";
}

function showAnswer() {
  document.querySelector(".modal-button-container *").style.display = "flex";
  document.querySelector(".answer").style.display = "flex";
  document.querySelector(".hidden-text").style.display = "flex";
  document.querySelector(".modalBtn-showAnswer").style.display = "none";
}

window.onload = function () {
  document
    .querySelector(".createBattlefield")
    .addEventListener("click", openModal);
  document.querySelector(".modalBtn-yes").addEventListener("click", () => {
    hit = true;
  });
  document.querySelector(".modalBtn-no").addEventListener("click", closeModal)
  document.querySelector(".modalBtn-showAnswer").addEventListener("click", showAnswer)
  document.querySelector(".modalBtn-no").addEventListener("click", closeModal);
  document.querySelector(".startGame").addEventListener("click", startGame);
  document.querySelector(".modalClose").addEventListener("click", closeModal);
  document
    .querySelector(".saveModal")
    .addEventListener("click", createBattlefields);
  document.querySelector("#firstTeam").addEventListener("change", function (e) {
    firstTeam = e.target.value;
    console.log(firstTeam);
    document.querySelector("#counter-text-1").style.display = "none";
    document.querySelector("#counter-text-1").innerHTML = firstTeam; // Update text immediately after change
  });
  document
    .querySelector("#secondTeam")
    .addEventListener("change", function (e) {
      secondTeam = e.target.value;
      console.log(secondTeam);
      document.querySelector("#counter-text-2").style.display = "none";
      document.querySelector("#counter-text-2").innerHTML = secondTeam; // Update text immediately after change
    });
};
