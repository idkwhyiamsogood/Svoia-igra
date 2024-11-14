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
// На завтра
// не работает вывод модалки на экран при попадании что-то надо сделать с импортом хуево работает
// залить на гитхаб чтобы можно было чекать версии 
// В целом
// сделать drag n drop
const questions = [
  {
    title: "1",
    answer: "Кто написал роман 'Война и мир'?",
  },
  {
    title: "2",
    answer: "Какой газ имеет химическую формулу O2?",
  },
  {
    title: "3",
    answer: "Какой элемент имеет атомный номер 1?",
  },
  {
    title: "4",
    answer: "Какой материк является самым большим по площади?",
  },
  {
    title: "5",
    answer: "Какой процесс используется растениями для производства еды?",
  },
  {
    title: "6",
    answer: "Какой океан является самым большим?",
  },
  {
    title: "7",
    answer: "Кто был первым человеком на Луне?",
  },
  {
    title: "8",
    answer: "Какой известный художник написал 'Мона Лиза'?",
  },
  {
    title: "9",
    answer: "Какой элемент обозначается символом Au?",
  },
  {
    title: "10",
    answer: "Какой год считается началом Второй мировой войны?",
  },
  {
    title: "11",
    answer: "Как называется планета, известная как 'Красная планета'?",
  },
  {
    title: "12",
    answer: "Кто написал 'Гарри Поттера'?",
  },
  {
    title: "13",
    answer: "Какой элемент имеет символ К?",
  },
  {
    title: "14",
    answer: "Какой зверь является символом США?",
  },
  {
    title: "15",
    answer: "Какой процесс осуществляется в ядерных реакторах?",
  },
  {
    title: "16",
    answer: "Какое самое высокое здание в мире на 2023 год?",
  },
  {
    title: "17",
    answer: "Какой язык является самым распространенным в мире?",
  },
  {
    title: "18",
    answer: "Как называется самая высокая гора на Земле?",
  },
  {
    title: "19",
    answer: "Кто открыл закон всемирного тяготения?",
  },
  {
    title: "20",
    answer: "Какой водоем является самым глубоким в мире?",
  },
  {
    title: "21",
    answer: "Кто является основателем компании Microsoft?",
  },
  {
    title: "22",
    answer: "Как называется столица Японии?",
  },
  {
    title: "23",
    answer: "Какой газ составляет большую часть атмосферы Земли?",
  },
  {
    title: "24",
    answer: "Какой древнегреческий философ был учителем Платона?",
  },
  {
    title: "25",
    answer: "Кто написал 'Анну Каренину'?",
  },
  {
    title: "26",
    answer: "Какой орган человека отвечает за кровообращение?",
  },
  {
    title: "27",
    answer:
      "Какой математический символ используется для обозначения числа пи?",
  },
  {
    title: "28",
    answer: "Какое животное является самым большим на планете?",
  },
  {
    title: "29",
    answer: "Как называется музыкальный инструмент с клавишами?",
  },
  {
    title: "30",
    answer:
      "Какой спортивный термин используется для обозначения игры без счёта?",
  },
  {
    title: "31",
    answer: "Какое химическое вещество является главной частью пластыри?",
  },
  {
    title: "32",
    answer: "Какой континент назван в честь мифической богини?",
  },
  {
    title: "33",
    answer: "Какое время года следует за зимой?",
  },
  {
    title: "34",
    answer: "Какой элемент имеет символ Fe?",
  },
  {
    title: "35",
    answer: "Какой крупнейший млекопитающий на планете обитает в океанах?",
  },
  {
    title: "36",
    answer: "Кто изобрёл телефон?",
  },
  {
    title: "37",
    answer: "Какое домашнее животное часто называют 'пушистиком'?",
  },
  {
    title: "38",
    answer: "Какой цвет получается при смешивании синих и жёлтых пигментов?",
  },
  {
    title: "39",
    answer:
      "Какой крупный технологический праздник отмечается в первом месяце осени?",
  },
];

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
  document.querySelectorAll(".modalBackground")[2].style.display = "block";
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
  document.querySelectorAll(".modalBackground")[1].style.display = "block";
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
  document.querySelectorAll(".modalActive").forEach((modal) => {
    modal.style.display = "none";
  });
  document.querySelector(".modal-button-container *").style.display = "none";
  document.querySelector(".answer").style.display = "none";
  document.querySelector(".hidden-text").style.display = "none";
}

function openModal() {
  document.querySelector(".createBattlefield").style.display = "none";
  document.querySelector(".modalBackground").style.display = "block";
  document.querySelector(".modalActive").style.display = "block";
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
