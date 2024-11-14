// Важные переменные
let clocksInterval;
let currentGameMode = "commands";
let lastCommandId = -1;
let commandsData = [];
let currentRound = -1;
let currentQuestion = "";

let gameData = {};

$(document).ready(function() {
    $(".show-answer").click(function() {
        // Показать ответ
        showAnswer();
    });

    $(".right").click(function() {
        // Ответ верный -> + счёт
        commandsData[lastCommandId].scores += parseInt(currentQuestion.split("-")[1]);
        nextCommand();
        refreshScoresTable();
        closeDialog();
    });

    $(".wrong").click(function() {
        // Ответ неверный
        nextCommand();
        refreshScoresTable();
        closeDialog();
    });
});

function closeDialog(){
    // Закрыть диалог
    $("dialog")[0].close();
    $("dialog").hide();
    stopClocksInterval();
}

function showAnswer(){
    // Показать ответ и нужные кнопки
    $("dialog h3").show();
    $("dialog .show-answer").hide();
    $("dialog .right").show();
    $("dialog .wrong").show();
    stopClocksInterval();
}

function setClocksInterval(){
    // Интервал для уменьшения счётчика
    clocksInterval = setInterval(() => {
        let $timer = $("#dialog-timer");
        let currentTime = $timer.text();
        let [minutes, seconds] = currentTime.split(":");
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);

        if(seconds == 0){
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        if(seconds == 0 && minutes == 0) {
            // Показать ответ, если время вышло
            showAnswer();
        }

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $timer.html(minutes + ":" + seconds);
    }, 1000);
}

function stopClocksInterval(){
    clearInterval(clocksInterval);
}

function saveCommands(){
    // Сохраняем список команд и настраиваем переменные
    let names = $(".commands-area textarea").val().split("\n");
    names.forEach(item => {
        commandsData.push({
            name: item,
            scores: 0
        })
    })

    lastCommandId = 0;
    currentGameMode = "playing";

    prepareGameUI();
}

function refreshScoresTable(){
    // Обновляем таблицу с текущими очками
    let $table = $("table.scores");

    $table.html("");
    commandsData.forEach(item => {
        $table.append(`<tr><th>${item.name}</th><td>${item.scores}</td></tr>`);
    })
}

function nextCommand(){
    // Следующая команда (или первая, игра по кругу)
    lastCommandId++;
    if(!commandsData[lastCommandId]){
        lastCommandId = 0;
    }
    updateCurrentCommand();

    if(isGameEnded()){
        alert("Переходим к следующему раунду");
        nextRound();
    }
}

function isGameEnded(){
    // Проверить, все ли вопросы отвечены в этом раунде
    let answeredCnt = $(".game-field td.used").length;
    return answeredCnt === Object.keys(gameData.data).length;
}

function renderTable(){
    const $table = $('.game-field');
    $table.html("");
    
    // Генерируем саму таблицу
    for (let i = 0; i < gameData.categories.length; i++) {
        let headerRow = '<tr>';
        headerRow += `<th>${gameData.categories[i].title}</th>`;

        for (let n = 1; n <= gameData.maxPrice / 100; n++) {
            headerRow += `<td data-category="${gameData.categories[i].id}">${n * 100}</td>`;
        }
        headerRow += '</tr>';
        $table.append(headerRow);
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
                showDialog(questionTitle, gameData.data[id].description, gameData.data[id].answer);
                $(this).addClass("used");
            }
        }
    });
}

function nextRound(){
    $(".game-round-title").show();
    currentRound++;
    if(!mock[currentRound]) {
        alert("игра окончена!")
        return;
    }
    $(".game-round").text(`Раунд ${currentRound}`);

    gameData = mock[currentRound];
    closeDialog();
    $(".game-field td.used").removeClass("used");
    renderTable();
}