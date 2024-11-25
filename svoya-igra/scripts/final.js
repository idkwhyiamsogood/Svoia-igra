let finalCommands = [];
let currentFinalCategories = [];

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
    }
}