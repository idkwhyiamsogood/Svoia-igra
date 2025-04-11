let finalCommands = [];
let currentFinalCategories = [];
let finalCurData;
let cmdAnsweredRight = [];
let cmdScores = [];

// Анимация показа финала
function showFinal(){
    animateCSS("body", "fadeOut").then(() => {
        $("body").hide();
    
        // Обновляем и показываем таблицу счёта
        refreshScoresTable();
        $scoresTable.hide();
    
        // Показываем игровое поле
        $cmdsArea.hide();
        $gameTable.hide();

        $(".final").show();
        $(".final").fadeIn(250);

        $("body").show();
        animateCSS("body", "fadeIn");
    });
}

// Перейти к финалу
function goFinal(){
    commandsData.sort((a, b) => b.scores - a.scores);
    refreshScoresTable();
    finalCommands = [commandsData[0], commandsData[1]];

    currentGameMode = "final";

    $(".final .command1 .name").text(finalCommands[0].name);
    $(".final .command2 .name").text(finalCommands[1].name);

    $(".final .command1 .scors").text(finalCommands[0].scores + " б.");
    $(".final .command2 .scors").text(finalCommands[1].scores + " б.");
    showFinal();

    $roundTitle.text(`Финал`);
    $gameStatus.hide();

    loadFinalCategories();
}

// Загрузить список категорий
function loadFinalCategories(){
    mockFinal.categories.forEach(item => {
        currentFinalCategories.push(item.id);
        $(".final .categories table").append(`<tr><th onClick="final_deleteCategory(this)" data-category="${item.id}">${item.title}</th></tr>`);
    })
}

// Удалить категорию из списка
function final_deleteCategory(elem) {
    let id = $(elem).data("category");
    let idIndex = currentFinalCategories.indexOf(id);
    currentFinalCategories.splice(idIndex, 1);
    $(elem).remove();

    if(currentFinalCategories.length === 1){
        // Если осталась одна тема
        $(".final .categories table").css("pointer-events","none");
        finalCurData = mockFinal.data[currentFinalCategories[0]];

        if(finalCurData.description) $(".final .categories .question").text(finalCurData.description);

        if(finalCurData.image) $(".final .categories").append(`<img src="${finalCurData.image}" />`)
        
        $(".final .categories button").show();
    }
}

// Показать ответ и кнопки
function final_showAnswer(){
    $(".final .categories .answer").text(finalCurData.answer);
    $(".final .categories button").hide();

    $(".final .command1 input").prop('disabled', true);
    $(".final .command2 input").prop('disabled', true);
    cmdScores[0] = parseInt($(".final .command1 input").val());
    cmdScores[1] = parseInt($(".final .command2 input").val());

    $(".final .command1 button").show();
    $(".final .command2 button").show();
}

// Кто-то дал ответ на вопрос
function final_answer(isRight, cmdId){
    cmdAnsweredRight[cmdId] = isRight;

    $(`.final .command${cmdId + 1} button`).hide();

    if(isRight){
        let $scr = $(`.final .command${cmdId + 1} .scors`);
        let curScores = parseInt($scr.text().split(" "));
        let newScores = curScores + cmdScores[cmdId];
        $scr.text(`${newScores} б.`);
        finalCommands[cmdId].scores = newScores;
        commandsData[cmdId].scores = newScores;
    }

    if(cmdAnsweredRight.length === 2){
        // Если обе команды ответили
        final_goWinnersTable();
    }
}

// Показать таблицу победителей
function final_goWinnersTable(){
    commandsData.sort((a, b) => b.scores - a.scores);
    refreshScoresTable();
    
    $(".final").hide();
    $roundTitle.text(`Таблица победителей`);
    $(".winners").show();

    commandsData.forEach((item, i) => {
        $(".winners").append(`<div class="item">
                <div class="place ${i === 0 ? "first" : ""}">${i + 1}</div>
                <div class="title">${item.name}</div>
                <div class="value">${item.scores} б.</div>
            </div>`);
    })
}