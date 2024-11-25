function prepareGameUI(){
    animateCSS("body", "fadeOut").then(() => {
        $("body").hide();
        updateCurrentCommand();

        nextRound();
    
        // Обновляем и показываем таблицу счёта
        refreshScoresTable();
        $scoresTable.show();
    
        // Показываем игровое поле
        $cmdsArea.hide();
        $gameTable.show();
        $gameTable.fadeIn(250);

        $("body").show();
        animateCSS("body", "fadeIn");
    });
}

function closeDialog(){
    // Закрыть диалог
    $dlg[0].close();
    $dlg.hide();
    stopClocksInterval();
}

function showAnswer(){
    // Показать ответ и нужные кнопки
    $dlgDesc.show();
    $dlgShowBtn.hide();
    $dlgRightBtn.show();
    $dlgWrongBtn.show();
    stopClocksInterval();
}

// Показать диалог
function showDialog(title, description, answer, startTimer = true){
    // Сбрасываем состояние диалога
    $dlgTitle.html(title);
    $dlgSubtitle.html(description);
    $dlgDesc.html(answer);
    $dlgRightBtn.hide();
    $dlgWrongBtn.hide();
    $dlgShowBtn.show();
    $dlgAuc.hide();
    $dlgIconCat.hide();
    $dlgIconAuc.hide();
    $dlgDesc.hide();
    $dlgTimer.text("01:00");
    if(startTimer) setClocksInterval();
    // Показываем диалог
    $dlg.show();
    $dlg[0].showModal();
}

// Диалог-аукцион
function dialogAuctionMode(price){
    $dlgAucPrice.val(price);
    $dlgAuc.show();
    $dlgIconAuc.show();

    // Загружаем список команд в select
    $dlgAucSelect.html("");
    commandsData.forEach((item, i) => {
        $dlgAucSelect.append(`<option value="${i}" ${i === lastCommandId ? "selected" : ""}>${item.name}</option>`);
    });
}

// Сохранить аукционное предложение
function dialogSaveAuction(){
    if($dlgAucPrice.css("display") !== "none"){
        let price = parseInt($dlgAucPrice.val());
        let title = $dlgTitle.text();
        let titleNoPrice = title.split(" ");
        titleNoPrice.pop();
        titleNoPrice = titleNoPrice.join(" ");
        $dlgTitle.text(`${titleNoPrice} ${price}`);

        currentQuestion = `${currentQuestion.split("-")[0]}-${price}`;
    }

    let cmdId = $dlgAucSelect.val();
    nextCommand(cmdId);
}

// Диалог - кот в мешке
function dialogCatMode(){
    $dlgIconCat.show();
    dialogAuctionMode(parseInt($(this).text()));
    $("dialog .auction-mode input").hide();
}

function updateCurrentCommand(){
    // Обновляем статус игры
    $gameStatus.text(`Сейчас играет: Команда ${commandsData[lastCommandId].name}`);
}

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);
  
      node.classList.add(`${prefix}animated`, animationName, `${prefix}faster`);
  
      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName, `${prefix}faster`);
        resolve('Animation ended');
      }
  
      node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });