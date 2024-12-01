// Важные переменные
let clocksInterval;
let currentGameMode = "commands";
let lastCommandId = -1;
let commandsData = [];
let currentRound = -1;
let currentQuestion = "";
let dialogMode = "";

let $lastCellClicked;

let gameData = {};

let $dlg = $("dialog");
let $dlgTimer = $("#dialog-timer");

let $dlgTitle = $("dialog h1");
let $dlgSubtitle = $("dialog h2");
let $dlgDesc = $("dialog h3");

let $dlgRightBtn = $("dialog .right");
let $dlgWrongBtn = $("dialog .wrong");
let $dlgShowBtn = $("dialog .show-answer");

let $dlgAuc = $("dialog .auction-mode");
let $dlgAucPrice = $("dialog .auction-mode input");
let $dlgAucSelect = $("dialog .auction-mode select");

let $dlgIconCat = $("dialog .catInBag-icon");
let $dlgIconAuc = $("dialog .auction-icon");

let $scoresTable = $("table.scores");
let $gameTable = $(".game-field");
let $gameStatus = $(".game-status");
let $title = $(".game-round-title");

let $roundTitle = $(".game-round");
let $cmdsArea = $(".commands-area");

$(document).ready(function() {
    $dlgShowBtn.click(function() {
        // Показать ответ
        showAnswer();
    });

    $dlgRightBtn.click(function() {
        // Ответ верный -> + счёт
        commandsData[lastCommandId].scores += parseInt(currentQuestion.split("-")[1]);
        $($lastCellClicked).addClass("ok used");
        nextCommand();
        refreshScoresTable();
        closeDialog();
    });

    $dlgWrongBtn.click(function() {
        // Ответ неверный
        $($lastCellClicked).addClass("wrong used");
        // Если это аукцион - вычитаем баллы
        if(dialogMode === "auction" || dialogMode === "catInBag"){
            commandsData[lastCommandId].scores -= parseInt(currentQuestion.split("-")[1]);
        }
        nextCommand();
        refreshScoresTable();
        closeDialog();
    });
});

function setClocksInterval(){
    // Интервал для уменьшения счётчика
    clocksInterval = setInterval(() => {
        let currentTime = $dlgTimer.text();
        let [minutes, seconds] = currentTime.split(":");
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);

        console.log(minutes, seconds);

        if(seconds == 0){
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        if(seconds == 0 && minutes == 0) {
            return $dlgTimer.html("Время вышло!");
        }

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $dlgTimer.html(minutes + ":" + seconds);
    }, 1000);
}

function stopClocksInterval(){
    clearInterval(clocksInterval);
}

function saveCommands(){
    // Сохраняем список команд и настраиваем переменные
    let names = $(".commands-area textarea").val().split("\n");
    names.forEach(item => {
        item = item.trim();
        if(item !== ''){
            commandsData.push({
                name: item,
                scores: 0
            })
        }
    })

    lastCommandId = 0;
    currentGameMode = "playing";

    prepareGameUI();
}

function refreshScoresTable(){
    // Обновляем таблицу с текущими очками
    $scoresTable.html("");
    commandsData.forEach(item => {
        $scoresTable.append(`<tr><th>${item.name}</th><td>${item.scores}</td></tr>`);
    })
}

function nextCommand(cmdId = null){
    // Следующая команда (или первая, игра по кругу)
    if(!cmdId){
        lastCommandId++;
        if(!commandsData[lastCommandId]){
            lastCommandId = 0;
        }
    } else {
        lastCommandId = cmdId;
    }
    updateCurrentCommand();

    if(isGameEnded()){
        $("#next-round-btn").show();
        //alert("Переходим к следующему раунду");
        //nextRound();
    }
}

function isGameEnded(){
    // Проверить, все ли вопросы отвечены в этом раунде
    let answeredCnt = $(".game-field td.used").length;
    return answeredCnt === Object.keys(gameData.data).length;
}

function renderTable(){
    $gameTable.html("");
    
    // Генерируем саму таблицу
    for (let i = 0; i < gameData.categories.length; i++) {
        let headerRow = '<tr>';
        headerRow += `<th>${gameData.categories[i].title}</th>`;

        for (let n = 1; n <= gameData.maxPrice / 100; n++) {
            headerRow += `<td data-category="${gameData.categories[i].id}">${n * 100}</td>`;
        }
        headerRow += '</tr>';
        $gameTable.append(headerRow);
    }

    // onClick
    $(".game-field td").click(function() {
        if(!$(this).hasClass("used")){
            let id = $(this).data("category") + "-" + $(this).text();
            var categoryData = gameData.categories.filter(obj => {
                return obj.id == $(this).data("category")
                })
            let questionTitle = `${categoryData[0].title} ${$(this).text()}`;
            currentQuestion = id;
            if (gameData.data[id]) {
                $lastCellClicked = this;
                if(gameData.data[id].auction){
                    // Если это аукцион
                    showDialog(questionTitle, gameData.data[id].description, gameData.data[id].answer, false);
                    dialogAuctionMode(parseInt($(this).text()));
                    dialogMode = "auction";
                } else if(gameData.data[id].catInBag){
                    // Если это кот в мешке
                    showDialog(questionTitle, gameData.data[id].description, gameData.data[id].answer, false);
                    dialogCatMode();
                    dialogMode = "catInBag";
                } else {
                    // Если это обычный вопрос
                    showDialog(questionTitle, gameData.data[id].description, gameData.data[id].answer);
                    dialogMode = "";
                }
            }
        }
    });
}

function nextRound(){
    $("#next-round-btn").hide();
    $title.show();
    currentRound++;
    if(!mock[currentRound]) {
        // Переходим к финалу
        //alert("Переходим к финалу!");
        goFinal();
        return;
    }
    $roundTitle.text(`Раунд ${currentRound + 1}`);

    gameData = mock[currentRound];
    closeDialog();
    $gameTable.children("td.used").removeClass("used");
    renderTable();
}